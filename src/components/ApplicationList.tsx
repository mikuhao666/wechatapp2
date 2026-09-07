import React, { useState } from 'react';
import { Application, ApplicationStatus, UserRole } from '../types';
import { 
  Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, Clock, 
  ExternalLink, Eye, Printer, Building, User as UserIcon, RefreshCw
} from 'lucide-react';

interface ApplicationListProps {
  applications: Application[];
  currentRole: UserRole;
  onViewDetail: (app: Application) => void;
  onDraftCertificate: (app: Application) => void;
  onApprove: (app: Application) => void;
  onPrintCertificate: (app: Application) => void;
  onAddNewApplication: () => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  currentRole,
  onViewDetail,
  onDraftCertificate,
  onApprove,
  onPrintCertificate,
  onAddNewApplication
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const statusList: { label: string; count: number }[] = [
    { label: '全部', count: applications.length },
    { label: '待受理', count: applications.filter(a => a.status === '待受理').length },
    { label: '开具中', count: applications.filter(a => a.status === '开具中').length },
    { label: '待审批', count: applications.filter(a => a.status === '待审批').length },
    { label: '已通过', count: applications.filter(a => a.status === '已通过').length },
    { label: '已驳回', count: applications.filter(a => a.status === '已驳回').length },
  ];

  const filtered = applications.filter(app => {
    const matchStatus = selectedStatus === '全部' || app.status === selectedStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery = !q || 
      app.applicant.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.disasterType.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case '待受理':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">待受理</span>;
      case '开具中':
        return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-medium">开具中</span>;
      case '待审批':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium ring-1 ring-amber-200">待审批</span>;
      case '已通过':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">已发放</span>;
      case '已驳回':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-medium">已驳回</span>;
      default:
        return null;
    }
  };

  const getDisasterTag = (type: string) => {
    let style = 'bg-slate-100 text-slate-600';
    if (type.includes('暴雨')) style = 'bg-blue-50 text-blue-600';
    else if (type.includes('大风') || type.includes('龙卷')) style = 'bg-orange-50 text-orange-600';
    else if (type.includes('冰雹')) style = 'bg-red-50 text-red-600';
    else if (type.includes('高温') || type.includes('干旱')) style = 'bg-amber-50 text-amber-700';
    else if (type.includes('低温') || type.includes('雪')) style = 'bg-cyan-50 text-cyan-700';

    return (
      <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${style}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            申请列表管理
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            随州市气象证明受理台账 · 农业水文与民生核灾保险公函全流程追踪
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddNewApplication}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            受理新办申请
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3.5">
        
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3" /> 状态筛选：
          </span>
          {statusList.map(item => (
            <button
              key={item.label}
              onClick={() => setSelectedStatus(item.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedStatus === item.label
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStatus === item.label ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入申请编号、申请人名称、灾害类型、联系电话或受灾地点搜索..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                清除
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-end">
            已检索到 <span className="font-bold text-blue-600 mx-1">{filtered.length}</span> 条申请记录
          </div>
        </div>

      </div>

      {/* Main Table in Elegant Dark Archetype */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 flex flex-col overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            最新申请队列
          </h4>
          <div className="flex gap-2">
            <span 
              onClick={() => setSelectedStatus('全部')}
              className={`text-[10px] px-2.5 py-1 rounded cursor-pointer transition font-medium ${
                selectedStatus === '全部' ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              全部 ({applications.length})
            </span>
            <span 
              onClick={() => setSelectedStatus('待审批')}
              className={`text-[10px] px-2.5 py-1 rounded cursor-pointer transition font-medium ${
                selectedStatus === '待审批' ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              待处理 ({applications.filter(a => a.status === '待审批' || a.status === '开具中').length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">申请编号</th>
                <th className="px-4 py-3">申请人 / 类型</th>
                <th className="px-4 py-3">联系电话</th>
                <th className="px-4 py-3">灾害类型</th>
                <th className="px-4 py-3">发生地点</th>
                <th className="px-4 py-3">提交时间</th>
                <th className="px-4 py-3 text-center">当前状态</th>
                <th className="px-4 py-3 text-right">业务操作</th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    <AlertCircle className="w-7 h-7 mx-auto mb-2 opacity-40" />
                    没有符合筛选条件的气象证明申请记录
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-4 py-3 font-mono text-slate-500">
                      <button 
                        onClick={() => onViewDetail(app)}
                        className="hover:underline text-left text-blue-900 font-semibold cursor-pointer"
                      >
                        {app.id}
                      </button>
                    </td>

                    {/* Applicant & Type */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 max-w-[160px] truncate" title={app.applicant}>
                        {app.applicant}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {app.type === '个人' ? '个人自然人' : '企事业单位'}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {app.phone}
                    </td>

                    {/* Disaster Type */}
                    <td className="px-4 py-3">
                      {getDisasterTag(app.disasterType)}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate" title={app.location}>
                      {app.location}
                    </td>

                    {/* Submit Time */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {app.submitTime}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetail(app)}
                          className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 text-xs transition"
                        >
                          详情
                        </button>

                        {/* Staff Action: Draft */}
                        {currentRole === 'staff' && (app.status === '待受理' || app.status === '开具中') && (
                          <button
                            onClick={() => onDraftCertificate(app)}
                            className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition cursor-pointer"
                          >
                            开具
                          </button>
                        )}

                        {/* Leader Action: Approve */}
                        {currentRole === 'leader' && app.status === '待审批' && (
                          <button
                            onClick={() => onApprove(app)}
                            className="px-2.5 py-1 text-xs bg-purple-700 hover:bg-purple-800 text-white rounded font-medium transition cursor-pointer shadow-xs animate-pulse"
                          >
                            审签
                          </button>
                        )}

                        {/* Approved Action: Print */}
                        {app.status === '已通过' && (
                          <button
                            onClick={() => onPrintCertificate(app)}
                            className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition cursor-pointer"
                          >
                            公函
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            数据源直连：随州市气象局综合气象观测探测网 · 自动站全天候实时回传
          </div>
          <div className="flex items-center gap-3">
            <span>当前登录身份：<strong className="text-slate-800">{currentRole === 'staff' ? '工作人员（经办）' : '分管领导（终审）'}</strong></span>
            <span>共 {applications.length} 项申报业务</span>
          </div>
        </div>

      </div>

    </div>
  );
};
