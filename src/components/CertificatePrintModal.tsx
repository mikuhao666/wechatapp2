import React, { useRef } from 'react';
import { Application } from '../types';
import { OfficialSeal } from './OfficialSeal';
import { Printer, Download, X, ShieldCheck, QrCode, FileCheck, Building2, User } from 'lucide-react';

interface CertificatePrintModalProps {
  application: Application;
  onClose: () => void;
}

export const CertificatePrintModal: React.FC<CertificatePrintModalProps> = ({
  application,
  onClose
}) => {
  const cert = application.certificate;
  const printRef = useRef<HTMLDivElement>(null);

  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const fullText = `【${cert.title}】\n文号：${cert.certNumber}\n\n主送：${cert.recipientOrg || '相关承办机构'}\n\n正文：\n${cert.content}\n\n经办人：${cert.draftedBy}\n审核签发：${cert.reviewedBy || '局领导（签批）'}\n出具单位：湖北省随州市气象局\n签发日期：${cert.reviewDate || cert.draftDate}`;
    navigator.clipboard.writeText(fullText);
    alert('证明公文正文已复制到剪贴板！');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Top Control Toolbar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-lg text-blue-400 border border-blue-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                气象灾害证明公文预览 (A4标准版)
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                  电子公章已核准
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                文号：{cert.certNumber} · 申请编号：{application.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              复制公文内容
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              打印 / 导出PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Container (Simulates Official Chinese Red-Header Letter Paper) */}
        <div className="p-6 md:p-12 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div 
            ref={printRef}
            className="w-full max-w-3xl bg-white shadow-lg p-10 md:p-16 border border-slate-200 relative print:shadow-none print:border-none print:p-8"
            style={{ minHeight: '850px' }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="text-7xl font-bold font-serif text-slate-900 transform -rotate-30">
                随州市气象局
              </span>
            </div>

            {/* Official Header (红头公文) */}
            <div className="text-center pb-6 border-b-2 border-red-600 relative">
              <div className="text-red-600 font-serif tracking-[0.25em] text-3xl font-extrabold mb-2">
                湖北省随州市气象局
              </div>
              <div className="text-red-600 text-sm font-semibold tracking-widest font-serif">
                SUIZHOU METEOROLOGICAL SERVICE OF HUBEI PROVINCE
              </div>
              <div className="h-0.5 bg-red-600 w-full mt-3"></div>
              <div className="h-[1px] bg-red-600 w-full mt-0.5"></div>
            </div>

            {/* Document Number and Confidential Level */}
            <div className="flex justify-between items-center text-xs text-slate-600 mt-4 mb-8 font-mono">
              <div>文号：{cert.certNumber}</div>
              <div className="flex items-center gap-2 text-slate-500">
                <span>防伪验真码：SZQX-{application.id.slice(-6)}-2026</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-6">
              <h1 className="text-2xl font-bold text-slate-900 font-serif tracking-widest">
                {cert.title || '气象灾害证明书'}
              </h1>
            </div>

            {/* Recipient Org */}
            <div className="text-slate-800 font-medium mb-4 text-base">
              {cert.recipientOrg ? `${cert.recipientOrg}：` : '相关承办单位：'}
            </div>

            {/* Certificate Body Paragraphs */}
            <div className="text-slate-800 leading-relaxed text-justify text-base space-y-4 indent-8 font-serif">
              <p className="indent-8">
                {cert.content}
              </p>
              <p className="indent-8">
                本证明系依据随州市气象局所属国家基本气象观测站、多普勒天气雷达及区域自动气象观测网系统实时记录的法定气象探测数据审定出具，数据具有法律效力与行业权威性，特此证明。
              </p>
              <p className="indent-8 text-sm text-slate-600 italic">
                （附注：本证明专用于办理{application.reason ? application.reason.slice(0, 30) : '财产保险理赔'}等相关核灾事宜，涂改或伪造无效。）
              </p>
            </div>

            {/* Meteorological Station Parameter Box */}
            <div className="my-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                气象探测技术参数与基准核定信息
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="text-slate-500">申请主体：</span>
                  <span className="font-medium text-slate-800">{application.applicant} ({application.type})</span>
                </div>
                <div>
                  <span className="text-slate-500">受灾类型：</span>
                  <span className="font-medium text-blue-700">{application.disasterType}</span>
                </div>
                <div>
                  <span className="text-slate-500">受灾发生时间：</span>
                  <span className="text-slate-800">{application.occurrenceTime}</span>
                </div>
                <div>
                  <span className="text-slate-500">受灾发生地点：</span>
                  <span className="text-slate-800">{application.location}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">测站数据摘要：</span>
                  <span className="text-slate-800 font-mono">{cert.obsDataSummary || '区域自动站监测达标'}</span>
                </div>
              </div>
            </div>

            {/* Official Signature and Stamp Seal Area */}
            <div className="mt-14 relative flex justify-end">
              <div className="w-72 text-right relative pr-4">
                <div className="text-slate-900 font-serif font-bold text-lg mb-1">
                  湖北省随州市气象局
                </div>
                <div className="text-slate-700 text-sm mb-1 font-serif">
                  （气象业务专用）
                </div>
                <div className="text-slate-700 text-sm font-serif">
                  签发日期：{cert.reviewDate ? cert.reviewDate.split(' ')[0] : (cert.draftDate ? cert.draftDate.split(' ')[0] : '2026年08月24日')}
                </div>

                {/* Overlaid Official Red Seal */}
                <div className="absolute right-0 -top-8 pointer-events-none">
                  <OfficialSeal 
                    organization="随州市气象局" 
                    sealType="气象业务专用章" 
                    size={140}
                  />
                </div>
              </div>
            </div>

            {/* Document Footer (Signature and QR Verification) */}
            <div className="mt-16 pt-4 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-300">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-700">扫码查验公文真伪</div>
                  <div>查验系统：随州市政务数据服务平台</div>
                  <div>经办人员：{cert.draftedBy || '李明（业务科）'}</div>
                  <div>审核领导：{cert.reviewedBy || '王局长（已签发）'}</div>
                </div>
              </div>

              <div className="text-right">
                <div>地址：湖北省随州市交通大道336号</div>
                <div>电话：0722-3315121 · 邮编：441300</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
