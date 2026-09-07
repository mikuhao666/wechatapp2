import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { NavTab } from './Sidebar';
import { 
  Search, Bell, Clock, ArrowLeftRight, ChevronRight, 
  HelpCircle, ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUserName: string;
  currentTab: NavTab;
  onSwitchRole: () => void;
  onLogout: () => void;
  pendingApprovalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUserName,
  currentTab,
  onSwitchRole,
  onLogout,
  pendingApprovalCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${m}月${d}日 ${days[now.getDay()]} ${hours}:${mins}:${secs}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabLabels: Record<NavTab, string> = {
    stats: '气象证明数据统计',
    list: '申请受理列表管理',
    draft: '气象证明正文开具',
    approval: '领导审批签批门户',
    verify: '证明公函防伪查验',
    export: '单文件HTML离线导出'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shadow-xs z-10 select-none print:hidden shrink-0">
      
      {/* Left: Breadcrumbs navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="hover:text-blue-600 transition cursor-pointer">首页</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">
          {tabLabels[currentTab] || '工作台'}
        </span>
      </div>

      {/* Right: Search, Notifications, Clock, Role Tag */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Search Input in Rounded Pill */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="搜索编号 / 申请人..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="pl-8 pr-4 py-1.5 bg-slate-100 rounded-full text-xs w-44 lg:w-52 border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-slate-400 rounded-full"></div>
        </div>

        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{timeStr || '09月07日 周一'}</span>
        </div>

        {/* Bell Notification Icon with red dot badge */}
        <div
          className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 relative hover:bg-blue-100 transition cursor-pointer"
          title={pendingApprovalCount > 0 ? `当前有 ${pendingApprovalCount} 条待批证明` : '暂无新待办提醒'}
        >
          {pendingApprovalCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
          <Bell className="w-4 h-4 text-blue-600" />
        </div>

        {/* Quick Role Switcher */}
        <button
          onClick={onSwitchRole}
          className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition cursor-pointer"
          title="点击在工作人员与领导角色之间切换"
        >
          <ArrowLeftRight className="w-3 h-3 text-blue-600" />
          <span>切换为: </span>
          <span className="font-bold text-blue-700">
            {currentRole === 'staff' ? '领导' : '工作人员'}
          </span>
        </button>

      </div>
    </header>
  );
};
