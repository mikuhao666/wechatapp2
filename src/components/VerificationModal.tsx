import React, { useState } from 'react';
import { Application } from '../types';
import { Search, ShieldCheck, AlertCircle, FileCheck, CheckCircle2, QrCode, Printer } from 'lucide-react';

interface VerificationModalProps {
  applications: Application[];
  onOpenPrint: (app: Application) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  applications,
  onOpenPrint
}) => {
  const [queryCode, setQueryCode] = useState<string>('随气证〔2026〕第0822号');
  const [result, setResult] = useState<Application | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = queryCode.trim();
    if (!q) return;

    const matched = applications.find(a => 
      a.certificate?.certNumber.toLowerCase().includes(q.toLowerCase()) ||
      a.id.toLowerCase() === q.toLowerCase() ||
      a.applicant.toLowerCase().includes(q.toLowerCase())
    );

    setResult(matched || null);
    setSearched(true);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-700" />
          随州市气象局气象证明公函防伪查验系统
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          承办银行、保险公司、司法机关及社会公众可在此输入证明编号或申请流水号，核验出具文书真实性与电子印章有效性。
        </p>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryCode}
            onChange={(e) => setQueryCode(e.target.value)}
            placeholder="输入证明文号（如：随气证〔2026〕第0822号）或申请流水号..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-bold shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          立即查验
        </button>
      </form>

      {/* Quick Example Pills */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>试验证号：</span>
        <button
          type="button"
          onClick={() => { setQueryCode('随气证〔2026〕第0822号'); }}
          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono"
        >
          随气证〔2026〕第0822号 (已通过)
        </button>
        <button
          type="button"
          onClick={() => { setQueryCode('随气证〔2026〕第0824号'); }}
          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono"
        >
          随气证〔2026〕第0824号 (待审批)
        </button>
      </div>

      {/* Result Card */}
      {searched && (
        <div className="pt-2">
          {result ? (
            <div className="p-6 rounded-xl bg-emerald-50/50 border border-emerald-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-base text-emerald-950">
                    查验结果：随州市气象局法定业务系统正式档案核验属实
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400">证明文号：</span>
                  <span className="font-mono font-bold text-blue-900">{result.certificate?.certNumber || '尚未正式编号'}</span>
                </div>
                <div>
                  <span className="text-slate-400">申请主体：</span>
                  <span className="font-semibold text-slate-900">{result.applicant} ({result.type})</span>
                </div>
                <div>
                  <span className="text-slate-400">灾害类型：</span>
                  <span className="font-bold text-blue-700">{result.disasterType}</span>
                </div>
                <div>
                  <span className="text-slate-400">发生时段：</span>
                  <span className="text-slate-900">{result.occurrenceTime}</span>
                </div>
                <div>
                  <span className="text-slate-400">事发地点：</span>
                  <span className="text-slate-900">{result.location}</span>
                </div>
                <div>
                  <span className="text-slate-400">经办起草人：</span>
                  <span className="text-slate-900">{result.certificate?.draftedBy || '李明'}</span>
                </div>
              </div>

              {result.certificate && (
                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-xs text-slate-800 leading-relaxed font-serif">
                  <div className="font-bold text-slate-900 mb-1 font-sans">证明正文核验摘要：</div>
                  {result.certificate.content}
                </div>
              )}

              {result.status === '已通过' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onOpenPrint(result)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    调阅正式公文原件 / 打印核验单
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <div className="font-bold text-slate-700 text-sm">未检索到匹配的官方气象证明记录</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                请仔细核对您输入的证明文号（例：随气证〔2026〕第0822号）或申请流水号是否完整。如有疑问可致电随州市气象台防伪核验电话：0722-3315121。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
