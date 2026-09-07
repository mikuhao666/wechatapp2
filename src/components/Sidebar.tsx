import React from 'react';
import { UserRole } from '../types';
import { 
  BarChart3, FileText, PenTool, CheckSquare, SearchCheck, 
  Download, Shield, User, ArrowLeftRight, CloudSun, CheckCircle2
} from 'lucide-react';

export type NavTab = 'stats' | 'list' | 'draft' | 'approval' | 'verify' | 'export';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole: UserRole;
  currentUserName: string;
  onSwitchRole: () => void;
  onLogout: () => void;
  pendingDraftCount: number;
  pendingApprovalCount: number;
  totalApplicationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  currentUserName,
  onSwitchRole,
  onLogout,
  pendingDraftCount,
  pendingApprovalCount,
  totalApplicationsCount
}) => {
  return (
    <aside className="w-64 bg-[#001529] text-white flex flex-col flex-shrink-0 shadow-xl border-r border-white/10 select-none print:hidden h-screen z-30">
      
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shrink-0">
          <CloudSun className="w-5 h-5 text-amber-300" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-sm font-semibold tracking-wider text-white truncate font-serif">
            随州气象证明管理
          </h1>
          <p className="text-[10px] text-slate-400 truncate tracking-wide">
            随州市气象局 · 业务审批平台
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        
        {/* Tab: 数据统计 */}
        <div
          onClick={() => onSelectTab('stats')}
          className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
            currentTab === 'stats'
              ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                currentTab === 'stats'
                  ? 'bg-blue-400 ring-2 ring-blue-400/30'
                  : 'bg-transparent border border-slate-500'
              }`}
            />
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">工作台首页</span>
          </div>
          <span className="text-[10px] text-blue-300/80 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
            大屏
          </span>
        </div>

        {/* Tab: 申请列表 */}
        <div
          onClick={() => onSelectTab('list')}
          className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
            currentTab === 'list'
              ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                currentTab === 'list'
                  ? 'bg-blue-400 ring-2 ring-blue-400/30'
                  : 'bg-transparent border border-slate-500'
              }`}
            />
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium">申请列表管理</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-slate-300">
            {totalApplicationsCount}
          </span>
        </div>

        {/* Tab: 证明开具 (工作人员专用) */}
        {currentRole === 'staff' && (
          <div
            onClick={() => onSelectTab('draft')}
            className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              currentTab === 'draft'
                ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  currentTab === 'draft'
                    ? 'bg-blue-400 ring-2 ring-blue-400/30'
                    : 'bg-transparent border border-slate-500'
                }`}
              />
              <PenTool className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">证明开具中心</span>
            </div>
            {pendingDraftCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/90 text-slate-950 font-bold">
                {pendingDraftCount}待制
              </span>
            )}
          </div>
        )}

        {/* Tab: 审批管理 (领导专用) */}
        {currentRole === 'leader' && (
          <div
            onClick={() => onSelectTab('approval')}
            className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              currentTab === 'approval'
                ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  currentTab === 'approval'
                    ? 'bg-blue-400 ring-2 ring-blue-400/30'
                    : 'bg-transparent border border-slate-500'
                }`}
              />
              <CheckSquare className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">审批管理门户</span>
            </div>
            {pendingApprovalCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse">
                {pendingApprovalCount}待批
              </span>
            )}
          </div>
        )}

        {/* Section Divider */}
        <div className="pt-5 pb-2 px-5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          辅助业务工具
        </div>

        {/* Tab: 证明查验 */}
        <div
          onClick={() => onSelectTab('verify')}
          className={`px-5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
            currentTab === 'verify'
              ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                currentTab === 'verify'
                  ? 'bg-blue-400 ring-2 ring-blue-400/30'
                  : 'bg-transparent border border-slate-500'
              }`}
            />
            <SearchCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium">防伪验真查询</span>
          </div>
        </div>

        {/* Tab: 导出单文件HTML */}
        <div
          onClick={() => onSelectTab('export')}
          className={`px-5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
            currentTab === 'export'
              ? 'bg-blue-600/20 border-r-4 border-blue-500 text-white font-medium'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                currentTab === 'export'
                  ? 'bg-blue-400 ring-2 ring-blue-400/30'
                  : 'bg-transparent border border-slate-500'
              }`}
            />
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium">导出单文件HTML</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">离线</span>
        </div>

      </nav>

      {/* Sidebar Footer User & Role Profile */}
      <div className="p-5 border-t border-white/10 bg-[#000e1c]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-blue-400/50 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
            {currentRole === 'leader' ? '领导' : '业务'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {currentRole === 'leader' ? '当前角色: 领导' : '当前角色: 工作人员'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
              {currentUserName}
            </p>
          </div>
        </div>

        {/* Role Switcher Pill Button */}
        <button
          onClick={onSwitchRole}
          className="mt-3 w-full py-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 rounded text-[11px] text-blue-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
          title="切换角色身份以体验不同审批环节"
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span>切换为: {currentRole === 'staff' ? '局领导' : '工作人员'}</span>
        </button>

        {/* Safe Logout Button */}
        <button
          onClick={onLogout}
          className="mt-2 w-full py-1.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-semibold text-slate-300 hover:text-white tracking-wider transition-colors uppercase cursor-pointer"
        >
          安全退出
        </button>

        {/* Meteorological Network Status */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            政务内网联通
          </span>
          <span className="font-mono">GB/T 33672</span>
        </div>
      </div>

    </aside>
  );
};
