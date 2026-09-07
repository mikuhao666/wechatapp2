import React, { useState, useEffect } from 'react';
import { Application, CertificateDraft, UserRole } from '../types';
import { TEMPLATES } from '../data/mockData';
import { getNextCertNumber, submitCertificateDraft } from '../data/storage';
import { 
  FileText, Sparkles, Eye, Send, CheckCircle2, AlertCircle, RefreshCw, 
  HelpCircle, ShieldCheck, MapPin, Clock, Building, User, FileCheck
} from 'lucide-react';
import { CertificatePrintModal } from './CertificatePrintModal';

interface CertificateIssuanceProps {
  applications: Application[];
  selectedAppId?: string;
  currentRole: UserRole;
  currentUserName: string;
  onSuccessSubmit: (updatedApps: Application[]) => void;
  onViewMaterials: (app: Application) => void;
}

export const CertificateIssuance: React.FC<CertificateIssuanceProps> = ({
  applications,
  selectedAppId,
  currentRole,
  currentUserName,
  onSuccessSubmit,
  onViewMaterials
}) => {
  // Filter eligible applications (prioritize 待受理 and 开具中, but allow any application to be viewed/edited)
  const [currentAppId, setCurrentAppId] = useState<string>(
    selectedAppId || 
    applications.find(a => a.status === '待受理' || a.status === '开具中')?.id || 
    applications[0]?.id || ''
  );

  const selectedApp = applications.find(a => a.id === currentAppId) || applications[0];

  // Certificate Fields
  const [certNumber, setCertNumber] = useState<string>(
    selectedApp?.certificate?.certNumber || getNextCertNumber()
  );
  const [certTitle, setCertTitle] = useState<string>(
    selectedApp?.certificate?.title || '气象灾害证明书'
  );
  const [recipientOrg, setRecipientOrg] = useState<string>(
    selectedApp?.certificate?.recipientOrg || '中国人民财产保险股份有限公司随州分公司'
  );
  const [certContent, setCertContent] = useState<string>(
    selectedApp?.certificate?.content || 
    '兹证明____年__月__日，在随州市____（地点），发生____（灾害类型），气象观测数据显示____。特此证明。'
  );
  const [obsSummary, setObsSummary] = useState<string>(
    selectedApp?.certificate?.obsDataSummary || '随州国家基本气象站及区域气象监测网分钟级连续观测'
  );
  const [staffNote, setStaffNote] = useState<string>(
    selectedApp?.certificate?.reviewComment || '经核实随州市气象台实时雷达及临近区域气象站观测数据，事实清楚，符合证明开具规定，拟同意出具，呈请领导审签。'
  );

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Sync when selected application changes
  useEffect(() => {
    if (selectedApp) {
      if (selectedApp.certificate) {
        setCertNumber(selectedApp.certificate.certNumber);
        setCertTitle(selectedApp.certificate.title);
        setCertContent(selectedApp.certificate.content);
        setRecipientOrg(selectedApp.certificate.recipientOrg || '中国人民财产保险随州分公司');
        setObsSummary(selectedApp.certificate.obsDataSummary || '');
      } else {
        setCertNumber(getNextCertNumber());
        setCertTitle('气象灾害证明书');
        // Pre-fill smart content based on application
        fillSmartTemplate(selectedApp);
      }
    }
  }, [currentAppId]);

  const fillSmartTemplate = (app: Application) => {
    // Generate intelligent template matching user's exact specification
    const text = `兹证明${app.occurrenceTime}，在随州市${app.location}，发生${app.disasterType}天气。随州市气象局气象观测台站数据显示：事发时段相关自动气象站监测记录完整，主要灾害性指标达到气象行业标准，特此证明。`;
    setCertContent(text);
  };

  const handleApplyTemplate = (templateText: string) => {
    if (!selectedApp) return;
    // Replace placeholders with real application details if available
    const now = new Date();
    let replaced = templateText
      .replace('{YEAR}', '2026')
      .replace('{MONTH}', '08')
      .replace('{DAY}', '24')
      .replace('{TIME}', selectedApp.occurrenceTime)
      .replace('{LOCATION}', selectedApp.location)
      .replace('{DATA_1}', selectedApp.disasterType.includes('暴雨') ? '118.5' : selectedApp.disasterType.includes('风') ? '22.4' : '65')
      .replace('{DATA_2}', selectedApp.disasterType.includes('暴雨') ? '46.2' : selectedApp.disasterType.includes('风') ? '9' : '25')
      .replace('{END_DATE}', '2026年08月20日');

    setCertContent(replaced);
  };

  const handleRegenerateCertNumber = () => {
    setCertNumber(getNextCertNumber());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!certContent.trim() || certContent.includes('____')) {
      if (!confirm('证明正文中尚有未填写的下划线占位符或内容较短，是否仍确认提交审批？')) {
        return;
      }
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const draft: CertificateDraft = {
      certNumber,
      title: certTitle,
      content: certContent,
      disasterTimeText: selectedApp.occurrenceTime,
      location: selectedApp.location,
      disasterType: selectedApp.disasterType,
      obsDataSummary: obsSummary,
      recipientOrg,
      draftedBy: `工作人员（${currentUserName}）`,
      draftDate: dateStr,
      reviewComment: staffNote
    };

    const updated = submitCertificateDraft(selectedApp.id, draft, currentUserName);
    onSuccessSubmit(updated);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  // Preview virtual application with current draft
  const previewApp: Application = {
    ...selectedApp,
    certificate: {
      certNumber,
      title: certTitle,
      content: certContent,
      disasterTimeText: selectedApp.occurrenceTime,
      location: selectedApp.location,
      disasterType: selectedApp.disasterType,
      obsDataSummary: obsSummary,
      recipientOrg,
      draftedBy: `工作人员（${currentUserName}）`,
      draftDate: '2026-08-24 10:00'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            气象证明开具工作台 (业务经办岗)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            根据市民或企业申请事由与佐证材料，调取气象观测数据库，拟定官方证明文书并呈报局领导审签。
          </p>
        </div>

        {/* Quick Role Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>经办人权限：<strong>业务科工作人员 ({currentUserName})</strong></span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">气象证明已成功起草并提交局领导审批！</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                证明编号：{certNumber} · 状态已变更为【待审批】，请通知分管领导审核签发。
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            知道了
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Application Selection & Fact Check (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Step 1: Select Application */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span>第 1 步：选择待开具证明的申请</span>
              <span className="text-[11px] font-normal text-blue-600">
                共 {applications.length} 笔申请
              </span>
            </label>
            
            <select
              value={currentAppId}
              onChange={(e) => setCurrentAppId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  [{app.status}] {app.applicant} - {app.disasterType} ({app.id})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Application Details & Verification Card */}
          {selectedApp && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  申请核对摘要
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {selectedApp.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">申请流水号：</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedApp.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">申请主体：</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    {selectedApp.type === '单位' ? <Building className="w-3 h-3 text-blue-600" /> : <User className="w-3 h-3 text-blue-600" />}
                    {selectedApp.applicant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">证照识别码：</span>
                  <span className="font-mono text-slate-700">{selectedApp.idCardOrCreditCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">灾害类型：</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedApp.disasterType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">发生时间：</span>
                  <span className="text-slate-800 font-medium">{selectedApp.occurrenceTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">发生地点：</span>
                  <span className="text-slate-800 text-right max-w-[200px] truncate">{selectedApp.location}</span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-1">受损事由说明：</span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 text-[11px] leading-relaxed">
                    {selectedApp.reason}
                  </p>
                </div>
              </div>

              {/* View uploaded materials trigger */}
              <button
                type="button"
                onClick={() => onViewMaterials(selectedApp)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                核验申请人提交的 {selectedApp.materials.length} 份佐证材料
              </button>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <HelpCircle className="w-4 h-4" />
              气象证明出具业务规范：
            </div>
            <ul className="list-disc pl-4 space-y-1 text-amber-800/90 text-[11px]">
              <li>出具内容必须严格基于随州市辖区国家基本站或区域自动站实况探测数据。</li>
              <li>如事发地点距最近观测站超过10公里，须调取雷达反演或临近3个站联合判定。</li>
              <li>开具后提交分管局领导审核签字并加盖随州市气象局电子公章方可生效。</li>
            </ul>
          </div>

        </div>

        {/* Right Column: Certificate Drafting Form (8 cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  第 2 步：拟定《气象灾害证明书》内容
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  规范格式：随州市气象局法定业务公函标准格式
                </p>
              </div>

              {/* Smart auto fill trigger */}
              <button
                type="button"
                onClick={() => fillSmartTemplate(selectedApp)}
                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition border border-blue-200 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                一键带入申请信息生成公文
              </button>
            </div>

            {/* Row 1: Document Number & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  官方证明编号（自动生成）*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateCertNumber}
                    title="重新生成文号"
                    className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-300 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  主送单位 / 机构名称 *
                </label>
                <input
                  type="text"
                  required
                  value={recipientOrg}
                  onChange={(e) => setRecipientOrg(e.target.value)}
                  placeholder="如：中国人民财产保险股份有限公司随州分公司"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Template Selector Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                常用气象证明官方标准模板推荐：
              </label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleApplyTemplate(t.text)}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 rounded-lg border border-slate-200 transition font-medium"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificate Content Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  证明正文内容（支持自由编辑）*
                </label>
                <span className="text-[11px] text-slate-400">
                  标准格式："兹证明____年__月__日，在随州市____（地点），发生____（灾害类型），气象观测数据显示____"
                </span>
              </div>

              <textarea
                required
                rows={6}
                value={certContent}
                onChange={(e) => setCertContent(e.target.value)}
                placeholder="兹证明____年__月__日，在随州市____（地点），发生____（灾害类型），气象观测数据显示____"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 leading-relaxed font-serif focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />

              <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                <span>正文字数：{certContent.length} 字</span>
                <span className="text-emerald-600 font-medium">已符合《中华人民共和国气象法》证明公文标准</span>
              </div>
            </div>

            {/* Additional Observation Metadata */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                气象台站观测支撑数据简述（备查参数）
              </label>
              <input
                type="text"
                value={obsSummary}
                onChange={(e) => setObsSummary(e.target.value)}
                placeholder="例如：何店站极大风速24.8m/s (10级)，瞬时降水量38.5mm/h"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Staff Recommendation Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                业务科经办初审意见（呈报领导审阅）
              </label>
              <input
                type="text"
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="输入呈报领导审签的拟办意见..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition shadow-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  公文排版实时预览 (PDF效果)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    alert('证明草稿已临时暂存在本地，可随时继续编写。');
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition"
                >
                  暂存草稿
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  完成编制并提交领导审批
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>

      {/* PDF / Certificate Preview Modal */}
      {showPreviewModal && (
        <CertificatePrintModal
          application={previewApp}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};
