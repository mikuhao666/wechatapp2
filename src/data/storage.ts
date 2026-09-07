import { Application, WorkflowLog, CertificateDraft } from '../types';
import { INITIAL_APPLICATIONS } from './mockData';
import { 
  fetchApplicationsFromCloud, 
  saveApplicationToCloud, 
  submitCloudCertificateDraft, 
  approveCloudCertificate, 
  rejectCloudCertificate 
} from './cloudbase';

const STORAGE_KEY = 'suizhou_qxj_applications_v1';

export function getStoredApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplications(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications to localStorage', err);
  }
}

export function resetApplicationsToDefault(): Application[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
}

export function getNextCertNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `随气证〔${year}〕第08${randomSuffix}号`;
}

export function updateApplication(updatedApp: Application): Application[] {
  const list = getStoredApplications();
  const index = list.findIndex(a => a.id === updatedApp.id);
  let newList: Application[];
  if (index >= 0) {
    newList = [...list];
    newList[index] = updatedApp;
  } else {
    newList = [updatedApp, ...list];
  }
  saveApplications(newList);

  // 异步写入腾讯云开发 CloudBase 数据库 applications 集合
  saveApplicationToCloud(updatedApp).catch((err) => {
    console.warn('[CloudBase] 异步写入云端失败:', err);
  });

  return newList;
}

export function submitCertificateDraft(
  appId: string, 
  cert: CertificateDraft, 
  operatorName: string
): Application[] {
  const list = getStoredApplications();
  const app = list.find(a => a.id === appId);
  if (!app) return list;

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

  const updated: Application = {
    ...app,
    status: '待审批',
    certificate: cert,
    logs: [...app.logs, newLog]
  };

  // 触发云端更新
  submitCloudCertificateDraft(appId, cert, operatorName).catch((err) => {
    console.warn('[CloudBase] 提交证明草稿至云数据库失败:', err);
  });

  return updateApplication(updated);
}

export function approveCertificate(
  appId: string,
  comment: string,
  operatorName: string
): Application[] {
  const list = getStoredApplications();
  const app = list.find(a => a.id === appId);
  if (!app || !app.certificate) return list;

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

  // 8. 审批通过时状态改为 "已办结"
  const updated: Application = {
    ...app,
    status: '已办结',
    certificate: {
      ...app.certificate,
      reviewComment: comment || '审核属实，准予开具证明。',
      reviewedBy: operatorName,
      reviewDate: timeStr
    },
    logs: [...app.logs, newLog]
  };

  // 异步更新云数据库
  approveCloudCertificate(appId, comment, operatorName).catch((err) => {
    console.warn('[CloudBase] 审批通过同步云端失败:', err);
  });

  return updateApplication(updated);
}

export function rejectCertificate(
  appId: string,
  reason: string,
  operatorName: string
): Application[] {
  const list = getStoredApplications();
  const app = list.find(a => a.id === appId);
  if (!app) return list;

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

  // 7. 驳回时状态改为 "已驳回" 并记录驳回原因
  const updated: Application = {
    ...app,
    status: '已驳回',
    certificate: app.certificate ? {
      ...app.certificate,
      rejectReason: reason,
      reviewedBy: operatorName,
      reviewDate: timeStr
    } : {
      certNumber: '',
      title: '气象灾害证明书',
      content: '',
      disasterTimeText: app.occurrenceTime,
      location: app.location,
      disasterType: app.disasterType,
      obsDataSummary: '',
      recipientOrg: '',
      draftedBy: '',
      draftDate: '',
      rejectReason: reason,
      reviewedBy: operatorName,
      reviewDate: timeStr
    },
    logs: [...app.logs, newLog]
  };

  // 异步更新云数据库
  rejectCloudCertificate(appId, reason, operatorName).catch((err) => {
    console.warn('[CloudBase] 驳回同步云端失败:', err);
  });

  return updateApplication(updated);
}

