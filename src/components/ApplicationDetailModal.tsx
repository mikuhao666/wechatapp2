import React, { useState } from 'react';
import { Application, UserRole, MaterialItem } from '../types';
import { 
  X, Calendar, MapPin, Phone, User, Building, FileText, CheckCircle2, 
  Clock, AlertTriangle, ShieldAlert, Eye, Download, History, ExternalLink, Printer
} from 'lucide-react';

interface ApplicationDetailModalProps {
  application: Application;
  currentRole: UserRole;
  onClose: () => void;
  onDraftCertificate?: (app: Application) => void;
  onApprove?: (app: Application) => void;
  onPrintCertificate?: (app: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  currentRole,
  onClose,
  onDraftCertificate,
  onApprove,
  onPrintCertificate
}) => {
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待受理':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">待受理</span>;
      case '开具中':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">开具中</span>;
      case '待审批':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300 animate-pulse">待审批</span>;
      case '已通过':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">已通过（已制证）</span>;
      case '已驳回':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300">已驳回</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-white">申请详情与佐证材料</h3>
                {getStatusBadge(application.status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                申请流水号：{application.id} · 提交时间：{application.submitTime}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6">
          
          {/* Rejection Alert if Rejected */}
          {application.status === '已驳回' && application.certificate?.rejectReason && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-800">审批退回/驳回通知</h4>
                <p className="text-sm mt-1">{application.certificate.rejectReason}</p>
                <div className="text-xs text-rose-600 mt-2">
                  审核人：{application.certificate.reviewedBy || '局领导'} · 审核时间：{application.certificate.reviewDate}
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Basic Applicant & Disaster Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Information */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                {application.type === '单位' ? <Building className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-blue-600" />}
                申请主体信息
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {application.type}申请
                </span>
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">申请人/单位名称：</span>
                  <span className="font-semibold text-slate-800">{application.applicant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{application.type === '单位' ? '统一信用代码' : '身份证号'}：</span>
                  <span className="font-mono text-slate-700">{application.idCardOrCreditCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系电话：</span>
                  <span className="font-mono text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {application.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系通讯地址：</span>
                  <span className="text-slate-700 text-right max-w-[240px] truncate">{application.address}</span>
                </div>
              </div>
            </div>

            {/* Disaster Claim Detail */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                灾害与理赔事实
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">灾害天气类型：</span>
                  <span className="font-bold text-blue-700 px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                    {application.disasterType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">受灾发生时间：</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {application.occurrenceTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">受灾确切地点：</span>
                  <span className="text-slate-800 flex items-center gap-1 max-w-[240px] truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {application.location}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1 text-xs">申请事由与损失说明：</span>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    {application.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Uploaded Materials (Click to inspect) */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                申报材料与佐证附件 ({application.materials.length}份)
              </span>
              <span className="text-xs text-slate-400">点击材料可直接在线查验核实</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {application.materials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat)}
                  className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition flex items-start gap-3 group"
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${mat.type === 'image' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {mat.type === 'image' ? <Eye className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
                      {mat.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>{mat.size}</span>
                      <span className="text-blue-600 group-hover:underline flex items-center gap-0.5">
                        查看核验 <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {mat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Official Certificate Status if Available */}
          {application.certificate && (
            <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  已编制气象证明文书
                  <span className="text-xs font-mono font-normal bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded">
                    {application.certificate.certNumber}
                  </span>
                </h4>
                {onPrintCertificate && application.status === '已通过' && (
                  <button
                    onClick={() => onPrintCertificate(application)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    打开正式公文 / 打印PDF
                  </button>
                )}
              </div>

              <div className="bg-white p-3 rounded border border-blue-100 text-xs text-slate-800 leading-relaxed font-serif">
                {application.certificate.content}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <div>起草经办：{application.certificate.draftedBy} ({application.certificate.draftDate})</div>
                {application.certificate.reviewedBy && (
                  <div className="text-emerald-700 font-medium">
                    审核签发：{application.certificate.reviewedBy} ({application.certificate.reviewDate})
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Workflow Audit Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              全流程办理日志与轨迹
            </h4>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {application.logs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100"></div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{log.operator}</span>
                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded text-[10px]">{log.role}</span>
                    <span className="text-slate-400 ml-auto">{log.time}</span>
                  </div>
                  {log.note && (
                    <div className="text-slate-500 mt-1 pl-0 text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                      {log.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            随州市气象局 · 气象灾害公共服务统一业务系统
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'staff' && (application.status === '待受理' || application.status === '开具中') && onDraftCertificate && (
              <button
                onClick={() => {
                  onClose();
                  onDraftCertificate(application);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                立即开具证明
              </button>
            )}

            {currentRole === 'leader' && application.status === '待审批' && onApprove && (
              <button
                onClick={() => {
                  onClose();
                  onApprove(application);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                去审批此件
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-lg transition"
            >
              关闭
            </button>
          </div>
        </div>

      </div>

      {/* Material Lightbox / Preview Modal */}
      {activeMaterial && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-base">{activeMaterial.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{activeMaterial.description} · 上传时间：{activeMaterial.uploadTime}</p>
              </div>
              <button onClick={() => setActiveMaterial(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[260px] border border-dashed border-slate-300 text-center">
              {activeMaterial.type === 'image' ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Eye className="w-10 h-10" />
                  </div>
                  <div className="font-medium text-slate-800">灾害现场查勘照片仿真预览</div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    已调取由气象行政服务大厅前端上传的高清实景核灾照片文件（分辨率 4032×3024，含经纬度GPS水印）。
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="font-medium text-slate-800">权威材料电子凭证 (PDF)</div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    已核验申报主体电子证照，加盖承办保险机构或乡镇农办核查签章。
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`文件【${activeMaterial.name}】已成功下载核验副本。`);
                }}
                className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium rounded flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                下载核验原件
              </button>
              <button
                onClick={() => setActiveMaterial(null)}
                className="px-4 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 transition"
              >
                已核验完毕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
