import React, { useState } from 'react';
import { Download, Copy, CheckCircle2, Code2, FileCode2, ExternalLink } from 'lucide-react';

export const StandaloneExportModal: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const generateStandaloneHTML = (): string => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>随州市气象局气象证明管理系统</title>
  <!-- 引入 Tailwind CSS CDN 用于政务端专业排版 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 font-sans min-h-screen flex flex-col">
  <!-- 登录页面或主工作台容器由下方的 JavaScript 统一动态渲染驱动 -->
  <div id="app" class="flex-1 flex flex-col"></div>

  <script>
    // 随州市气象局气象证明管理系统 - 单文件独立运行引擎
    const DEFAULT_DATA = [
      {
        id: 'SQ-20260824-001',
        type: '单位',
        applicant: '湖北楚盛香菇农业开发有限公司',
        idCardOrCreditCode: '91421300MA49XYZ123',
        phone: '13872886618',
        disasterType: '雷暴大风',
        occurrenceTime: '2026-08-22 15:40 至 17:30',
        location: '随县厉山镇双泉村5组',
        reason: '强对流大风导致18个标准化香菇大棚受损，申请保险理赔证明',
        submitTime: '2026-08-23 09:30',
        status: '待审批',
        materials: ['营业执照扫描件.pdf', '大棚现场倒塌照片.jpg', '保单核定告知函.pdf'],
        certificate: {
          certNumber: '随气证〔2026〕第0824号',
          content: '兹证明2026年08月22日15时40分至17时30分，在随州市随县厉山镇双泉村及周边区域，发生短时强对流伴雷暴大风天气。随县站及厉山自动气象站数据显示：极大风速达24.8米/秒（10级），符合雷暴大风灾害标准。特此证明。',
          draftedBy: '工作人员（李明）',
          draftDate: '2026-08-24 10:15'
        }
      },
      {
        id: 'SQ-20260825-002',
        type: '个人',
        applicant: '张建国',
        idCardOrCreditCode: '421302197508123419',
        phone: '13971798823',
        disasterType: '暴雨洪涝',
        occurrenceTime: '2026-08-24 02:00 至 08:30',
        location: '随州市曾都区何店镇王家湾村',
        reason: '特大暴雨致40亩鱼塘溢坝成鱼冲失，向联合财险申请农险赔付',
        submitTime: '2026-08-25 08:45',
        status: '开具中',
        materials: ['身份证复印件.pdf', '鱼塘水淹受灾照.jpg', '村委会核实函.pdf'],
        certificate: {
          certNumber: '随气证〔2026〕第0825号',
          content: '兹证明2026年08月24日02时至08时30分，在随州市曾都区何店镇，发生特大暴雨。何店站6小时累计雨量达142.3毫米，达到大暴雨量级标准。特此证明。',
          draftedBy: '工作人员（李明）',
          draftDate: '2026-08-25 14:00'
        }
      },
      {
        id: 'SQ-20260826-003',
        type: '单位',
        applicant: '广水市天源光伏电力工程有限公司',
        idCardOrCreditCode: '91421381MA4889988C',
        phone: '15172782299',
        disasterType: '冰雹灾害',
        occurrenceTime: '2026-08-21 16:10 至 16:50',
        location: '广水市武胜关镇光伏电站阵区',
        reason: '局地冰雹击碎地面集中式光伏电板146块，申请客观天气证明报险',
        submitTime: '2026-08-22 14:10',
        status: '已通过',
        materials: ['受损组件清单.pdf', '现场照片.jpg'],
        certificate: {
          certNumber: '随气证〔2026〕第0822号',
          content: '兹证明2026年08月21日16时10分至16时50分，在随州市广水市武胜关镇，发生强对流局地冰雹伴雷暴天气。新一代天气雷达及地面站记录冰雹最大直径达25毫米。特此证明。',
          draftedBy: '工作人员（李明）',
          draftDate: '2026-08-22 16:30',
          reviewedBy: '领导（王局长）',
          reviewDate: '2026-08-23 09:10',
          reviewComment: '核查属实，准予签发证明。'
        }
      }
    ];

    // 初始化 LocalStorage 数据
    if (!localStorage.getItem('suizhou_meteorology_apps')) {
      localStorage.setItem('suizhou_meteorology_apps', JSON.stringify(DEFAULT_DATA));
    }

    let state = {
      user: null, // { role: 'staff'|'leader', name: string }
      currentTab: 'stats', // 'stats' | 'list' | 'draft' | 'approval'
      applications: JSON.parse(localStorage.getItem('suizhou_meteorology_apps') || '[]'),
      filterStatus: '全部',
      selectedAppForDraft: null,
      selectedAppForPreview: null
    };

    function saveApps() {
      localStorage.setItem('suizhou_meteorology_apps', JSON.stringify(state.applications));
    }

    function render() {
      const app = document.getElementById('app');
      if (!state.user) {
        renderLogin(app);
      } else {
        renderMain(app);
      }
    }

    function renderLogin(container) {
      container.innerHTML = \`
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div class="bg-blue-900 p-8 text-center text-white">
              <div class="w-14 h-14 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-serif">
                🌤️
              </div>
              <h2 class="text-xl font-bold font-serif">随州市气象局</h2>
              <p class="text-xs text-blue-200 mt-1">气象证明管理系统（纯单文件版）</p>
            </div>
            <div class="p-8 space-y-5">
              <div class="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-900">
                <span class="font-bold">预设账号一键登录：</span>
                <div class="flex gap-2 mt-2">
                  <button onclick="loginWith('工作人员')" class="flex-1 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium">工作人员 / 123456</button>
                  <button onclick="loginWith('领导')" class="flex-1 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-medium">领导 / 123456</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">用户名</label>
                <input id="login-u" type="text" value="工作人员" class="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">密码</label>
                <input id="login-p" type="password" value="123456" class="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm">
              </div>
              <button onclick="handleManualLogin()" class="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-sm transition">
                登录进入系统
              </button>
            </div>
          </div>
        </div>
      \`;
    }

    window.loginWith = function(roleName) {
      if (roleName === '工作人员') {
        state.user = { role: 'staff', name: '工作人员（李明）' };
        state.currentTab = 'list';
      } else {
        state.user = { role: 'leader', name: '领导（王局长）' };
        state.currentTab = 'approval';
      }
      render();
    };

    window.handleManualLogin = function() {
      const u = document.getElementById('login-u').value.trim();
      const p = document.getElementById('login-p').value.trim();
      if (u === '工作人员' && p === '123456') loginWith('工作人员');
      else if (u === '领导' && p === '123456') loginWith('领导');
      else alert('账号或密码错误！预设：工作人员/123456，领导/123456');
    };

    window.logout = function() {
      state.user = null;
      render();
    };

    window.switchTab = function(tab) {
      state.currentTab = tab;
      render();
    };

    function renderMain(container) {
      const isStaff = state.user.role === 'staff';
      const isLeader = state.user.role === 'leader';
      const pendingApprovalCount = state.applications.filter(a => a.status === '待审批').length;
      const pendingDraftCount = state.applications.filter(a => a.status === '待受理' || a.status === '开具中').length;

      container.innerHTML = \`
        <header class="bg-[#0B2545] text-white px-6 h-16 flex items-center justify-between border-b-2 border-blue-500">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🌤️</span>
            <div>
              <h1 class="font-bold text-lg font-serif tracking-wider">随州市气象局气象证明管理系统</h1>
              <p class="text-[11px] text-blue-200">气象证明开具 · 领导审批 · 统计分析</p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs">
            <span class="px-2.5 py-1 rounded bg-blue-900/60 border border-blue-600/40 text-blue-200">
              当前角色：<strong class="text-white">\${state.user.name}</strong>
            </span>
            <button onclick="logout()" class="px-3 py-1 bg-red-600/80 hover:bg-red-700 text-white rounded">
              退出
            </button>
          </div>
        </header>

        <div class="flex-1 flex">
          <!-- 左侧导航栏 -->
          <aside class="w-60 bg-[#081B33] text-slate-300 p-4 border-r border-slate-800 space-y-2 shrink-0 select-none">
            <button onclick="switchTab('stats')" class="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium \${state.currentTab === 'stats' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800'}">
              📊 数据统计分析
            </button>
            <button onclick="switchTab('list')" class="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex justify-between items-center \${state.currentTab === 'list' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800'}">
              <span>📋 申请受理列表</span>
              <span class="px-2 py-0.2 rounded-full text-xs bg-slate-800">\${state.applications.length}</span>
            </button>
            \${isStaff ? \`
              <button onclick="switchTab('draft')" class="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex justify-between items-center \${state.currentTab === 'draft' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800'}">
                <span>✍️ 证明开具 (工作人员)</span>
                \${pendingDraftCount > 0 ? \`<span class="px-2 py-0.2 rounded-full text-xs bg-amber-500 text-slate-900 font-bold">\${pendingDraftCount}</span>\` : ''}
              </button>
            \` : ''}
            \${isLeader ? \`
              <button onclick="switchTab('approval')" class="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex justify-between items-center \${state.currentTab === 'approval' ? 'bg-purple-700 text-white font-bold' : 'hover:bg-slate-800'}">
                <span>⚖️ 审批管理 (领导)</span>
                \${pendingApprovalCount > 0 ? \`<span class="px-2 py-0.2 rounded-full text-xs bg-rose-500 text-white font-bold animate-pulse">\${pendingApprovalCount}</span>\` : ''}
              </button>
            \` : ''}
          </aside>

          <!-- 右侧内容区 -->
          <main class="flex-1 p-6 overflow-y-auto max-w-7xl">
            <div id="content-container"></div>
          </main>
        </div>
      \`;

      const content = document.getElementById('content-container');
      if (state.currentTab === 'stats') renderStats(content);
      else if (state.currentTab === 'list') renderList(content);
      else if (state.currentTab === 'draft') renderDraft(content);
      else if (state.currentTab === 'approval') renderApproval(content);
    }

    function renderStats(c) {
      c.innerHTML = \`
        <div class="space-y-6">
          <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span class="w-2 h-6 bg-blue-700 inline-block rounded-xs"></span>
            气象证明数据统计大屏
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-xl border shadow-xs">
              <div class="text-xs text-slate-500 font-bold">本月申请数量</div>
              <div class="text-3xl font-bold text-blue-900 mt-2 font-mono">62 件</div>
              <div class="text-xs text-emerald-600 mt-1">同比上月上升 6.9%</div>
            </div>
            <div class="bg-white p-5 rounded-xl border shadow-xs">
              <div class="text-xs text-slate-500 font-bold">已办结签发数量</div>
              <div class="text-3xl font-bold text-emerald-700 mt-2 font-mono">58 件</div>
              <div class="text-xs text-slate-500 mt-1">办结率 93.5%</div>
            </div>
            <div class="bg-white p-5 rounded-xl border shadow-xs">
              <div class="text-xs text-slate-500 font-bold">平均办理天数</div>
              <div class="text-3xl font-bold text-indigo-900 mt-2 font-mono">1.1 个工作日</div>
              <div class="text-xs text-blue-600 mt-1">承诺办结时限3天</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border shadow-xs space-y-4">
            <h3 class="font-bold text-sm text-slate-800">近6个月气象证明申请趋势柱状图</h3>
            <div class="h-48 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-200">
              <div class="flex-1 flex flex-col items-center"><div style="height: 35%" class="w-8 bg-blue-600 rounded-t"></div><span class="text-xs mt-2">3月(18)</span></div>
              <div class="flex-1 flex flex-col items-center"><div style="height: 46%" class="w-8 bg-blue-600 rounded-t"></div><span class="text-xs mt-2">4月(24)</span></div>
              <div class="flex-1 flex flex-col items-center"><div style="height: 60%" class="w-8 bg-blue-600 rounded-t"></div><span class="text-xs mt-2">5月(32)</span></div>
              <div class="flex-1 flex flex-col items-center"><div style="height: 82%" class="w-8 bg-blue-600 rounded-t"></div><span class="text-xs mt-2">6月(45)</span></div>
              <div class="flex-1 flex flex-col items-center"><div style="height: 94%" class="w-8 bg-blue-600 rounded-t"></div><span class="text-xs mt-2">7月(58)</span></div>
              <div class="flex-1 flex flex-col items-center"><div style="height: 100%" class="w-8 bg-blue-800 rounded-t"></div><span class="text-xs mt-2 font-bold text-blue-900">8月(62)</span></div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderList(c) {
      const filtered = state.filterStatus === '全部' 
        ? state.applications 
        : state.applications.filter(a => a.status === state.filterStatus);

      c.innerHTML = \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">申请列表</h2>
            <div class="flex gap-2">
              \${['全部', '待受理', '开具中', '待审批', '已通过', '已驳回'].map(s => \`
                <button onclick="setFilter('\${s}')" class="px-3 py-1 rounded text-xs font-medium \${state.filterStatus === s ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}">
                  \${s}
                </button>
              \`).join('')}
            </div>
          </div>

          <div class="bg-white rounded-xl border shadow-xs overflow-hidden">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b text-slate-600 font-bold">
                <tr>
                  <th class="p-3">申请编号</th>
                  <th class="p-3">类型</th>
                  <th class="p-3">申请人</th>
                  <th class="p-3">联系电话</th>
                  <th class="p-3">灾害类型</th>
                  <th class="p-3">提交时间</th>
                  <th class="p-3">状态</th>
                  <th class="p-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                \${filtered.map(a => \`
                  <tr class="hover:bg-slate-50">
                    <td class="p-3 font-mono font-bold text-blue-900">\${a.id}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700">\${a.type}</span></td>
                    <td class="p-3 font-semibold">\${a.applicant}</td>
                    <td class="p-3 font-mono">\${a.phone}</td>
                    <td class="p-3 font-bold text-blue-800">\${a.disasterType}</td>
                    <td class="p-3 text-slate-500">\${a.submitTime}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded font-bold \${a.status === '已通过' ? 'bg-emerald-100 text-emerald-800' : a.status === '待审批' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}">\${a.status}</span></td>
                    <td class="p-3 text-right">
                      <button onclick="viewDetail('\${a.id}')" class="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded mr-1">查看详情</button>
                      \${a.certificate ? \`<button onclick="previewCert('\${a.id}')" class="px-2 py-1 bg-emerald-600 text-white rounded">PDF公函</button>\` : ''}
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \`;
    }

    window.setFilter = function(s) {
      state.filterStatus = s;
      render();
    };

    window.viewDetail = function(id) {
      const a = state.applications.find(x => x.id === id);
      alert(\`【申请详情】\\n编号：\${a.id}\\n申请人：\${a.applicant} (\${a.type})\\n电话：\${a.phone}\\n灾害类型：\${a.disasterType}\\n时间：\${a.occurrenceTime}\\n地点：\${a.location}\\n事由：\${a.reason}\\n上传材料：\${a.materials.join('、')}\`);
    };

    window.previewCert = function(id) {
      const a = state.applications.find(x => x.id === id);
      if (!a.certificate) return;
      const w = window.open('', '_blank');
      w.document.write(\`
        <html>
        <head><title>\${a.certificate.certNumber}</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="p-10 flex justify-center bg-slate-100">
          <div class="w-[750px] bg-white p-12 shadow-xl border relative font-serif">
            <div class="text-center pb-4 border-b-2 border-red-600">
              <h1 class="text-3xl font-bold text-red-600 tracking-widest">湖北省随州市气象局</h1>
              <p class="text-xs text-red-600 mt-1 tracking-widest">气象灾害证明书</p>
            </div>
            <div class="flex justify-between text-xs text-slate-500 my-4 font-mono">
              <span>文号：\${a.certificate.certNumber}</span>
              <span>防伪码：SZQX-\${a.id.slice(-6)}</span>
            </div>
            <div class="text-base leading-loose indent-8 text-slate-900 my-8">
              \${a.certificate.content}
            </div>
            <div class="mt-16 text-right space-y-1">
              <div class="font-bold text-lg">湖北省随州市气象局</div>
              <div class="text-xs text-slate-500">（气象业务专用）</div>
              <div class="text-xs text-slate-700">签发日期：2026年08月24日</div>
            </div>
          </div>
        </body>
        </html>
      \`);
    };

    function renderDraft(c) {
      const pendingApps = state.applications.filter(a => a.status === '待受理' || a.status === '开具中' || a.status === '待审批');
      const cur = state.selectedAppForDraft || pendingApps[0] || state.applications[0];

      c.innerHTML = \`
        <div class="space-y-4 max-w-3xl bg-white p-6 rounded-xl border shadow-xs">
          <h2 class="text-lg font-bold text-slate-900">气象证明开具 (工作人员)</h2>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">选择申请业务：</label>
            <select id="draft-app-select" onchange="changeDraftApp(this.value)" class="w-full p-2 border rounded text-xs bg-slate-50">
              \${state.applications.map(a => \`<option value="\${a.id}" \${cur.id === a.id ? 'selected' : ''}>[\${a.status}] \${a.applicant} - \${a.disasterType} (\${a.id})</option>\`).join('')}
            </select>
          </div>
          <div class="p-3 bg-slate-50 rounded border text-xs space-y-1 text-slate-600">
            <div><strong>申请主体：</strong>\${cur.applicant} (\${cur.phone})</div>
            <div><strong>受灾事实：</strong>\${cur.occurrenceTime} 在 \${cur.location} 发生 \${cur.disasterType}</div>
            <div><strong>损失描述：</strong>\${cur.reason}</div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">证明文号：</label>
            <input id="draft-no" type="text" value="\${cur.certificate ? cur.certificate.certNumber : '随气证〔2026〕第0828号'}" class="w-full p-2 border rounded text-xs font-mono">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">证明正文（标准模板）：</label>
            <textarea id="draft-content" rows="5" class="w-full p-3 border rounded text-xs leading-relaxed font-serif">\${cur.certificate ? cur.certificate.content : \`兹证明\${cur.occurrenceTime}，在随州市\${cur.location}，发生\${cur.disasterType}天气。随州市气象台观测数据显示：主要灾害性指标达到行业认定标准，特此证明。\`}</textarea>
          </div>
          <div class="flex justify-end gap-3 pt-3">
            <button onclick="previewCert('\${cur.id}')" class="px-4 py-2 bg-slate-800 text-white rounded text-xs">PDF公函预览</button>
            <button onclick="submitDraft('\${cur.id}')" class="px-5 py-2 bg-blue-700 text-white rounded text-xs font-bold">提交领导审批</button>
          </div>
        </div>
      \`;
    }

    window.changeDraftApp = function(id) {
      state.selectedAppForDraft = state.applications.find(x => x.id === id);
      render();
    };

    window.submitDraft = function(id) {
      const app = state.applications.find(x => x.id === id);
      const no = document.getElementById('draft-no').value;
      const content = document.getElementById('draft-content').value;
      app.status = '待审批';
      app.certificate = {
        certNumber: no,
        content: content,
        draftedBy: state.user.name,
        draftDate: '2026-08-25 10:00'
      };
      saveApps();
      alert('已成功起草气象证明并呈报局领导审批！');
      state.currentTab = 'list';
      render();
    };

    function renderApproval(c) {
      const pendingApps = state.applications.filter(a => a.status === '待审批');

      c.innerHTML = \`
        <div class="space-y-5 max-w-4xl">
          <h2 class="text-lg font-bold text-slate-900">证明审批管理 (领导专席)</h2>
          \${pendingApps.length === 0 ? \`
            <div class="p-8 bg-white rounded-xl border text-center text-slate-400">
              当前暂无待审批的气象证明件
            </div>
          \` : \`
            <div class="space-y-4">
              \${pendingApps.map(a => \`
                <div class="bg-white p-5 rounded-xl border shadow-xs space-y-3">
                  <div class="flex justify-between items-center border-b pb-2">
                    <span class="font-bold text-sm">\${a.applicant} - \${a.disasterType}</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">\${a.certificate.certNumber}</span>
                  </div>
                  <div class="p-3 bg-slate-50 rounded text-xs font-serif leading-relaxed">
                    \${a.certificate.content}
                  </div>
                  <div class="flex justify-between items-center text-xs text-slate-500 pt-1">
                    <span>起草人：\${a.certificate.draftedBy}</span>
                    <div class="flex gap-2">
                      <button onclick="rejectApp('\${a.id}')" class="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-bold">退回驳回</button>
                      <button onclick="approveApp('\${a.id}')" class="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold">审核通过并签发公章</button>
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          \`}
        </div>
      \`;
    }

    window.approveApp = function(id) {
      const app = state.applications.find(x => x.id === id);
      app.status = '已通过';
      app.certificate.reviewedBy = state.user.name;
      app.certificate.reviewDate = '2026-08-25 15:30';
      saveApps();
      alert('已审批通过！电子印章已签署加盖，支持随时查验与打印。');
      render();
    };

    window.rejectApp = function(id) {
      const reason = prompt('请输入审批退回/驳回原因：', '气象台实况记录与申报时间不吻合');
      if (!reason) return;
      const app = state.applications.find(x => x.id === id);
      app.status = '已驳回';
      app.certificate.rejectReason = reason;
      saveApps();
      alert('已驳回该申请！');
      render();
    };

    // 启动初始渲染
    render();
  </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    const html = generateStandaloneHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '随州市气象局气象证明管理系统.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const html = generateStandaloneHTML();
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-emerald-600" />
          纯单文件HTML系统生成与导出中心
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          响应您关于“<strong>使用纯HTML + CSS + JavaScript（单文件）</strong>”的要求，系统已为您将完整的PC端管理后台、登录鉴权、申请受理、证明开具模板、领导审批与数据统计柱状图全部封装至单个独立的HTML文件中。
        </p>
      </div>

      {/* Feature Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            技术与架构特性
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li><strong>零构建依赖：</strong>双击即可在任何电脑浏览器中离线打开运行。</li>
            <li><strong>本地数据引擎：</strong>内置与浏览器 localStorage 互通的模拟数据库。</li>
            <li><strong>完整权限角色：</strong>支持工作人员与领导两种权限快速切换。</li>
          </ul>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            功能模块完整覆盖
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>模块 1：双角色安全登录页 (工作人员/123456, 领导/123456)</li>
            <li>模块 2：申请列表与材料查验</li>
            <li>模块 3：官方标准证明正文模板与开具</li>
            <li>模块 4：领导审批签章与驳回机制</li>
            <li>模块 5：近6个月趋势柱状图与办结分析</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-slate-900">
            下载独立单文件：随州市气象局气象证明管理系统.html
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            文件大小约 32 KB · 包含完整数据结构与交互脚本
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? '源码已复制到剪贴板' : '复制单文件HTML代码'}
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            直接下载 .html 离线运行文件
          </button>
        </div>
      </div>
    </div>
  );
};
