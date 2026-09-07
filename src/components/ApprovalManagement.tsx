import React, { useState } from 'react';
import { Application, UserRole } from '../types';
import { approveCertificate, rejectCertificate } from '../data/storage';
import { 
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, FileText, Eye, 
  Printer, Clock, MapPin, Building, User, History, MessageSquare, ExternalLink
} from 'lucide-react';
import { CertificatePrintModal } from './CertificatePrintModal';
import { OfficialSeal } from './OfficialSeal';

interface ApprovalManagementProps {
  applications: Application[];
  currentRole: UserRole;
  currentUserName: string;
  onUpdateApplications: (updated: Application[]) => void;
  onViewMaterials: (app: Application) => void;
}

export const ApprovalManagement: React.FC<ApprovalManagementProps> = ({
  applications,
  currentRole,
  currentUserName,
  onUpdateApplications,
  onViewMaterials
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  
  // Modals state
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [approvalComment, setApprovalComment] = useState<string>('情况属实，气象观测数据完整准确，准予签发官方气象证明。');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  const pendingApps = applications.filter(a => a.status === '待审批');
  const historyApps = applications.filter(a => a.status === '已通过' || a.status === '已办结' || a.status === '已驳回');

  // Currently inspected app in review desk
  const currentApp = applications.find(a => a.id === selectedAppId) || 
    (activeTab === 'pending' ? pendingApps[0] : historyApps[0]);

  const presetReasons = [
    '经调取随州国家基本站实况数据，事发时段监测风速未达到灾害大风标准（仅3级微风），与申请描述不符。',
    '观测资料显示事发当日降水量小于10毫米，未出现强降雨或暴雨灾害特征，不满足证明出具条件。',
    '申报出险时间与新一代天气雷达回波图谱存在明显偏差，需申请人进一步核实具体受灾时段。',
    '上传的支撑佐证附件不全，缺少村委会或受损现场带有GPS时空水印的实地勘察影像。'
  ];

  const handleApprove = () => {
    if (!currentApp) return;
    const updated = approveCertificate(currentApp.id, approvalComment, currentUserName);
    onUpdateApplications(updated);
    setActionSuccessMsg(`申请【${currentApp.applicant}】的气象证明已完成领导签批，状态已转为“已办结”，并同步更新至腾讯云数据库！`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleConfirmReject = () => {
    if (!currentApp) return;
    if (!rejectReason.trim()) {
      alert('请填写驳回具体原因！');
      return;
    }
    const updated = rejectCertificate(currentApp.id, rejectReason, currentUserName);
    onUpdateApplications(updated);
    setShowRejectModal(false);
    setRejectReason('');
    setActionSuccessMsg(`申请【${currentApp.applicant}】已被审批退回驳回，已记录驳回原因并同步至腾讯云数据库。`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
            气象证明审批管理 (领导专席)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            审核业务科起草的气象灾害证明公函内容，核验探测数据及证据真实性，行使行政终审签批与电子印章加盖权限。
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-900 rounded-lg text-xs border border-purple-100">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>当前签发权限：<strong>主管领导 ({currentUserName})</strong></span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-xs text-emerald-700 hover:text-emerald-900 font-medium">
            关闭
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('pending');
            setSelectedAppId(pendingApps[0]?.id || '');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>待审批业务</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'pending' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
          }`}>
            {pendingApps.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            setSelectedAppId(historyApps[0]?.id || '');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>已审批历史归档</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {historyApps.length}
          </span>
        </button>
      </div>

      {/* Main Approval Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of items (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            {activeTab === 'pending' ? '待审签件列表' : '历史审签记录'}
          </div>

          {(activeTab === 'pending' ? pendingApps : historyApps).length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">暂无此项业务记录</p>
            </div>
          ) : (
            (activeTab === 'pending' ? pendingApps : historyApps).map(app => {
              const isSelected = currentApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-400 shadow-xs ring-1 ring-purple-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {app.id}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      app.status === '待审批' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                      (app.status === '已通过' || app.status === '已办结') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 truncate">
                    {app.applicant}
                  </div>

                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span className="font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {app.disasterType}
                    </span>
                    <span className="text-slate-400">{app.submitTime.split(' ')[0]}</span>
                  </div>

                  {app.certificate && (
                    <div className="text-[11px] text-slate-500 truncate pt-1 border-t border-slate-100">
                      文号：{app.certificate.certNumber}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Inspection & Decision Desk (8 cols) */}
        <div className="lg:col-span-8">
          {currentApp ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">
                      审批办理案卷：{currentApp.applicant}
                    </h3>
                    <span className="text-xs font-normal px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {currentApp.type}申请
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    流水号：{currentApp.id} · 发生时间：{currentApp.occurrenceTime} · 地点：{currentApp.location}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewMaterials(currentApp)}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    查验原件材料 ({currentApp.materials.length})
                  </button>

                  {currentApp.certificate && (
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition border border-blue-200 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      红头公文排版预览
                    </button>
                  )}
                </div>
              </div>

              {/* Loss & Fact Summary */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div className="font-bold text-slate-800">申请事由与损失描述：</div>
                <p className="leading-relaxed text-slate-600">{currentApp.reason}</p>
              </div>

              {/* Drafted Certificate Official Display Box */}
              {currentApp.certificate ? (
                <div className="border-2 border-purple-200 rounded-xl p-5 bg-purple-50/20 relative">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100">
                    <div className="font-bold text-sm text-purple-950 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-700" />
                      业务科呈报证明草案
                      <span className="font-mono text-xs font-normal bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        {currentApp.certificate.certNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      起草人：{currentApp.certificate.draftedBy} ({currentApp.certificate.draftDate})
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-700">
                      主送单位：{currentApp.certificate.recipientOrg || '承办机构'}
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-purple-100 text-sm font-serif text-slate-800 leading-relaxed indent-8 shadow-2xs">
                      {currentApp.certificate.content}
                    </div>

                    <div className="text-xs text-slate-500 bg-white/70 p-2.5 rounded border border-purple-100 font-mono">
                      <span className="font-bold text-slate-700">气象站实况核验参数：</span>
                      {currentApp.certificate.obsDataSummary || '随州站观测序列正常'}
                    </div>

                    {currentApp.certificate.reviewComment && (
                      <div className="text-xs text-blue-900 bg-blue-50/70 p-2.5 rounded border border-blue-200">
                        <span className="font-bold">经办初审意见：</span>
                        {currentApp.certificate.reviewComment}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500 opacity-60" />
                  此件尚未起草证明文书，请先通知经办人员完成实况数据调取与公文初稿编写。
                </div>
              )}

              {/* Status Specific Details if already reviewed */}
              {(currentApp.status === '已通过' || currentApp.status === '已办结') && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    领导审签结论：审核通过（已办结），已签发正式电子证明并同步云端
                  </div>
                  <div className="text-emerald-800">
                    签署领导：{currentApp.certificate?.reviewedBy || '王局长'} · 签发时间：{currentApp.certificate?.reviewDate}
                  </div>
                  <div className="text-emerald-700 mt-1">
                    批语：{currentApp.certificate?.reviewComment}
                  </div>
                </div>
              )}

              {currentApp.status === '已驳回' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    领导审签结论：审核不予通过（已驳回）
                  </div>
                  <div className="text-rose-800">
                    审核领导：{currentApp.certificate?.reviewedBy || '王局长'} · 审核时间：{currentApp.certificate?.reviewDate}
                  </div>
                  <div className="text-rose-700 mt-1">
                    驳回理由：{currentApp.certificate?.rejectReason}
                  </div>
                </div>
              )}

              {/* Leader Approval Action Form (Only visible when status is 待审批) */}
              {currentApp.status === '待审批' && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      主管领导签批意见（通过时自动写入公文系统留档）：
                    </label>
                    <input
                      type="text"
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      退回并填写驳回原因
                    </button>

                    <button
                      type="button"
                      onClick={handleApprove}
                      className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      审核通过并加盖电子印章
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              请从左侧列表选择一笔业务进行查验审批
            </div>
          )}
        </div>

      </div>

      {/* Reject Reason Modal Dialog */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base border-b pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              填写气象证明审批退回 / 驳回决定书
            </div>

            <p className="text-xs text-slate-600">
              退回后将直接反馈给申请人及业务经办科室。驳回意见必须有据可循（如测站实况不符、非气象灾害等）。
            </p>

            {/* Quick Reasons Chips */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">
                选用常见法定驳回理由模版：
              </span>
              <div className="space-y-1.5">
                {presetReasons.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectReason(r)}
                    className="w-full text-left text-xs p-2 rounded bg-slate-50 hover:bg-rose-50 hover:text-rose-900 border border-slate-200 hover:border-rose-300 transition text-slate-700 leading-snug"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                驳回具体原因（必填）*
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请详细说明驳回所依据的气象台站探测事实或规定..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                确认驳回该申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF / Formal Letter Preview */}
      {showPreviewModal && currentApp && (
        <CertificatePrintModal
          application={currentApp}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};
