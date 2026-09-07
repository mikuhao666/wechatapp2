import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  CloudSun, Shield, Lock, User, CheckCircle2, AlertCircle, 
  ArrowRight, ShieldCheck
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, username: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('工作人员');
  const [password, setPassword] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const u = username.trim();
    const p = password.trim();

    if (u === '工作人员' && p === '123456') {
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess('staff', '工作人员（李明）');
      }, 350);
    } else if (u === '领导' && p === '123456') {
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess('leader', '领导（王局长）');
      }, 350);
    } else {
      setErrorMsg('用户名或密码错误。预设账号：工作人员/123456，领导/123456');
    }
  };

  const handleQuickFill = (role: 'staff' | 'leader') => {
    if (role === 'staff') {
      setUsername('工作人员');
      setPassword('123456');
      setErrorMsg('');
    } else {
      setUsername('领导');
      setPassword('123456');
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-[#001529] flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="py-6 px-8 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg">
            <CloudSun className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wider text-white font-serif">
              随州市气象局
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">
              Suizhou Meteorological Bureau
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          政务内网安全认证环境
        </div>
      </div>

      {/* Main Login Card Centered */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Card Top Title in Midnight Dark Theme */}
          <div className="bg-[#001529] p-8 text-center text-white relative border-b border-white/10">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <CloudSun className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-lg font-bold tracking-wider font-serif">
              气象证明管理系统
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              证明出具 · 领导审批 · 公函防伪 · 效能监控
            </p>
          </div>

          {/* Form Area */}
          <div className="p-8 space-y-5">
            
            {/* Quick Fill Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                快捷身份填入：
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('staff')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    username === '工作人员'
                      ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  工作人员 / 123456
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('leader')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    username === '领导'
                      ? 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-100 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  局领导 / 123456
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  登录用户名
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="工作人员 / 领导"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  系统密码
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码（预设：123456）"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-600 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  气象观测专网就绪
                </span>
                <span className="text-[11px] text-slate-400">
                  初始口令：123456
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>正在登录系统...</span>
                ) : (
                  <>
                    <span>登录工作台</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
              随州市气象局信息中心 · 运维保障电话：0722-3315121
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 relative z-10">
        随州市气象局 版权所有 · 气象灾害证明业务规范标准 GB/T 33672-2017
      </footer>

    </div>
  );
};
