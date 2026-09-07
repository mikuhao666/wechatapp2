import { Application, CertificateDraft, WorkflowLog } from '../types';
import { INITIAL_APPLICATIONS } from './mockData';

// 腾讯云开发 CloudBase 配置
export const CLOUDBASE_ENV_ID = 'weathersuizhou-d5guy17wnc64dbda3';
export const COLLECTION_NAME = 'applications';

export interface CloudConnectionStatus {
  connected: boolean;
  envId: string;
  collection: string;
  source: 'cloud' | 'local';
  lastSyncTime?: string;
  error?: string;
}

let tcbAppInstance: any = null;
let currentConnectionStatus: CloudConnectionStatus = {
  connected: false,
  envId: CLOUDBASE_ENV_ID,
  collection: COLLECTION_NAME,
  source: 'local'
};

/**
 * 确保加载并初始化腾讯云开发 CloudBase SDK
 */
export async function getTcbApp(): Promise<any> {
  if (tcbAppInstance) {
    return tcbAppInstance;
  }

  // 检查 window.tcb 是否已经加载
  const win = window as any;
  if (!win.tcb) {
    // 等待最多 3 秒看 script 标签是否完成装载
    await new Promise<void>((resolve) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (win.tcb || attempts > 30) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  if (!win.tcb) {
    throw new Error('未检测到腾讯云开发 tcb.js SDK，请检查网络或脚本加载状态。');
  }

  try {
    // 2. 用指定环境 ID 初始化 SDK
    const app = win.tcb.init({
      env: CLOUDBASE_ENV_ID
    });

    // 进行匿名登录以获取访问云数据库的权限
    try {
      const auth = app.auth();
      const hasLogin = typeof auth.hasLoginState === 'function' ? auth.hasLoginState() : false;
      if (!hasLogin) {
        if (typeof auth.signInAnonymously === 'function') {
          await auth.signInAnonymously();
        } else if (auth.anonymousAuthProvider && typeof auth.anonymousAuthProvider().signIn === 'function') {
          await auth.anonymousAuthProvider().signIn();
        }
      }
    } catch (authErr) {
      console.warn('[CloudBase] 匿名登录提示（非阻断）:', authErr);
    }

    tcbAppInstance = app;
    currentConnectionStatus = {
      connected: true,
      envId: CLOUDBASE_ENV_ID,
      collection: COLLECTION_NAME,
      source: 'cloud',
      lastSyncTime: new Date().toLocaleTimeString()
    };

    return app;
  } catch (err: any) {
    currentConnectionStatus = {
      connected: false,
      envId: CLOUDBASE_ENV_ID,
      collection: COLLECTION_NAME,
      source: 'local',
      error: err?.message || '初始化失败'
    };
    throw err;
  }
}

export function getConnectionStatus(): CloudConnectionStatus {
  return currentConnectionStatus;
}

/**
 * 从云数据库 applications 集合读取所有申请数据
 * 若集合为空，则自动预填初始示范数据
 */
export async function fetchApplicationsFromCloud(): Promise<Application[]> {
  try {
    const app = await getTcbApp();
    const db = app.database();
    const collection = db.collection(COLLECTION_NAME);

    // 查询 applications 集合全部数据
    const res = await collection.limit(100).get();

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      // 规范化数据格式（兼容历史或新增字段）
      const list: Application[] = res.data.map((doc: any) => ({
        _id: doc._id,
        id: doc.id,
        type: doc.type || '个人',
        applicant: doc.applicant || '未知申请人',
        idCardOrCreditCode: doc.idCardOrCreditCode || '',
        phone: doc.phone || '',
        address: doc.address || '',
        disasterType: doc.disasterType || '暴雨洪涝',
        occurrenceTime: doc.occurrenceTime || '',
        location: doc.location || '',
        reason: doc.reason || '',
        submitTime: doc.submitTime || '',
        status: doc.status || '待受理',
        materials: Array.isArray(doc.materials) ? doc.materials : [],
        certificate: doc.certificate || undefined,
        logs: Array.isArray(doc.logs) ? doc.logs : []
      }));

      currentConnectionStatus = {
        connected: true,
        envId: CLOUDBASE_ENV_ID,
        collection: COLLECTION_NAME,
        source: 'cloud',
        lastSyncTime: new Date().toLocaleTimeString()
      };

      // 同步一份至本地缓存备用
      try {
        localStorage.setItem('suizhou_qxj_applications_v1', JSON.stringify(list));
      } catch {}

      return list;
    }

    // 若云数据库 applications 集合为空，自动导入初始示范业务数据
    console.log('[CloudBase] applications 集合当前为空，正在同步初始示范数据至云端...');
    for (const item of INITIAL_APPLICATIONS) {
      try {
        const cleanDoc = JSON.parse(JSON.stringify(item));
        await collection.add(cleanDoc);
      } catch (seedErr) {
        console.warn('[CloudBase] 导入记录失败:', seedErr);
      }
    }

    // 重新获取已写入的数据
    const seededRes = await collection.limit(100).get();
    if (seededRes && Array.isArray(seededRes.data) && seededRes.data.length > 0) {
      const seededList: Application[] = seededRes.data.map((doc: any) => ({
        ...doc,
        _id: doc._id
      }));
      try {
        localStorage.setItem('suizhou_qxj_applications_v1', JSON.stringify(seededList));
      } catch {}
      return seededList;
    }

    return INITIAL_APPLICATIONS;
  } catch (err) {
    console.warn('[CloudBase] 读取云数据库失败，自动降级采用本地持久化缓存:', err);
    currentConnectionStatus = {
      connected: false,
      envId: CLOUDBASE_ENV_ID,
      collection: COLLECTION_NAME,
      source: 'local',
      error: '正在使用离线缓存'
    };

    // 降级使用本地存储
    try {
      const local = localStorage.getItem('suizhou_qxj_applications_v1');
      if (local) return JSON.parse(local);
    } catch {}
    return INITIAL_APPLICATIONS;
  }
}

/**
 * 5. 证明开具时，将证明内容和状态写回云数据库对应记录
 */
export async function submitCloudCertificateDraft(
  appId: string,
  cert: CertificateDraft,
  operatorName: string
): Promise<Application[]> {
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newLog: WorkflowLog = {
    id: 'log-' + Date.now(),
    time: timeStr,
    operator: operatorName,
    role: '业务科工作人员',
    action: '完成气象证明草稿编制并呈报领导审批',
    note: `证明文号：${cert.certNumber}`
  };

  try {
    const app = await getTcbApp();
    const db = app.database();
    const collection = db.collection(COLLECTION_NAME);

    // 查找对应记录
    const query = await collection.where({ id: appId }).get();
    if (query && query.data && query.data.length > 0) {
      const targetDoc = query.data[0];
      const existingLogs = Array.isArray(targetDoc.logs) ? targetDoc.logs : [];
      const updatedLogs = [...existingLogs, newLog];

      await collection.doc(targetDoc._id).update({
        status: '待审批',
        certificate: cert,
        logs: updatedLogs
      });
    } else {
      // 若未找到对应 ID，则新添加
      await collection.add({
        id: appId,
        status: '待审批',
        certificate: cert,
        logs: [newLog]
      });
    }

    // 刷新云数据库最新列表
    return await fetchApplicationsFromCloud();
  } catch (err) {
    console.error('[CloudBase] 提交证明草稿至云端发生异常，同步至本地更新:', err);
    // 降级回退保证界面实时响应
    const currentList = getLocalFallbackApplications();
    const idx = currentList.findIndex(a => a.id === appId);
    if (idx >= 0) {
      currentList[idx] = {
        ...currentList[idx],
        status: '待审批',
        certificate: cert,
        logs: [...currentList[idx].logs, newLog]
      };
      saveLocalFallback(currentList);
    }
    return currentList;
  }
}

/**
 * 6. 审批操作（通过）：更新云数据库中的状态字段为 "已办结"
 */
export async function approveCloudCertificate(
  appId: string,
  comment: string,
  operatorName: string
): Promise<Application[]> {
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newLog: WorkflowLog = {
    id: 'log-' + Date.now(),
    time: timeStr,
    operator: operatorName,
    role: '分管局领导',
    action: '审批通过，签署电子公章并正式办结',
    note: comment || '审核属实，准予开具证明并归档。'
  };

  try {
    const app = await getTcbApp();
    const db = app.database();
    const collection = db.collection(COLLECTION_NAME);

    const query = await collection.where({ id: appId }).get();
    if (query && query.data && query.data.length > 0) {
      const targetDoc = query.data[0];
      const existingLogs = Array.isArray(targetDoc.logs) ? targetDoc.logs : [];
      const updatedCertificate = {
        ...(targetDoc.certificate || {}),
        reviewComment: comment || '审核属实，准予开具证明。',
        reviewedBy: operatorName,
        reviewDate: timeStr
      };

      // 8. 审批通过时状态改为 "已办结"
      await collection.doc(targetDoc._id).update({
        status: '已办结',
        certificate: updatedCertificate,
        logs: [...existingLogs, newLog]
      });
    }

    return await fetchApplicationsFromCloud();
  } catch (err) {
    console.error('[CloudBase] 审批通过写回云端发生异常，同步至本地更新:', err);
    const currentList = getLocalFallbackApplications();
    const idx = currentList.findIndex(a => a.id === appId);
    if (idx >= 0) {
      const item = currentList[idx];
      currentList[idx] = {
        ...item,
        status: '已办结',
        certificate: item.certificate ? {
          ...item.certificate,
          reviewComment: comment || '审核属实，准予开具证明。',
          reviewedBy: operatorName,
          reviewDate: timeStr
        } : undefined,
        logs: [...item.logs, newLog]
      };
      saveLocalFallback(currentList);
    }
    return currentList;
  }
}

/**
 * 7. 驳回时状态改为 "已驳回" 并记录驳回原因
 */
export async function rejectCloudCertificate(
  appId: string,
  reason: string,
  operatorName: string
): Promise<Application[]> {
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newLog: WorkflowLog = {
    id: 'log-' + Date.now(),
    time: timeStr,
    operator: operatorName,
    role: '分管局领导',
    action: '审批退回/驳回',
    note: `驳回理由：${reason}`
  };

  try {
    const app = await getTcbApp();
    const db = app.database();
    const collection = db.collection(COLLECTION_NAME);

    const query = await collection.where({ id: appId }).get();
    if (query && query.data && query.data.length > 0) {
      const targetDoc = query.data[0];
      const existingLogs = Array.isArray(targetDoc.logs) ? targetDoc.logs : [];
      const updatedCertificate = {
        ...(targetDoc.certificate || {}),
        rejectReason: reason,
        reviewedBy: operatorName,
        reviewDate: timeStr
      };

      // 7. 驳回时状态改为 "已驳回" 并记录驳回原因
      await collection.doc(targetDoc._id).update({
        status: '已驳回',
        certificate: updatedCertificate,
        logs: [...existingLogs, newLog]
      });
    }

    return await fetchApplicationsFromCloud();
  } catch (err) {
    console.error('[CloudBase] 驳回写回云端发生异常，同步至本地更新:', err);
    const currentList = getLocalFallbackApplications();
    const idx = currentList.findIndex(a => a.id === appId);
    if (idx >= 0) {
      const item = currentList[idx];
      currentList[idx] = {
        ...item,
        status: '已驳回',
        certificate: item.certificate ? {
          ...item.certificate,
          rejectReason: reason,
          reviewedBy: operatorName,
          reviewDate: timeStr
        } : undefined,
        logs: [...item.logs, newLog]
      };
      saveLocalFallback(currentList);
    }
    return currentList;
  }
}

/**
 * 添加或保存一条申请数据至云数据库
 */
export async function saveApplicationToCloud(newApp: Application): Promise<Application[]> {
  try {
    const app = await getTcbApp();
    const db = app.database();
    const collection = db.collection(COLLECTION_NAME);

    // 检查是否存在
    const query = await collection.where({ id: newApp.id }).get();
    if (query && query.data && query.data.length > 0) {
      const targetDoc = query.data[0];
      const { _id, ...rest } = newApp;
      await collection.doc(targetDoc._id).set(rest);
    } else {
      const { _id, ...rest } = newApp;
      await collection.add(rest);
    }

    return await fetchApplicationsFromCloud();
  } catch (err) {
    console.error('[CloudBase] 保存记录至云端发生异常:', err);
    const currentList = getLocalFallbackApplications();
    const idx = currentList.findIndex(a => a.id === newApp.id);
    let updated: Application[];
    if (idx >= 0) {
      updated = [...currentList];
      updated[idx] = newApp;
    } else {
      updated = [newApp, ...currentList];
    }
    saveLocalFallback(updated);
    return updated;
  }
}

function getLocalFallbackApplications(): Application[] {
  try {
    const raw = localStorage.getItem('suizhou_qxj_applications_v1');
    return raw ? JSON.parse(raw) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

function saveLocalFallback(apps: Application[]): void {
  try {
    localStorage.setItem('suizhou_qxj_applications_v1', JSON.stringify(apps));
  } catch {}
}
