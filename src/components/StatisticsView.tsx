import React, { useState } from 'react';
import { Application } from '../types';
import { MONTHLY_STATS } from '../data/mockData';
import { 
  BarChart3, TrendingUp, CheckCircle2, Clock, Calendar, 
  ShieldAlert, Users, Layers, Award, Radio
} from 'lucide-react';

interface StatisticsViewProps {
  applications: Application[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ applications }) => {
  const [hoveredMonth, setHoveredMonth] = useState<any | null>(null);

  // Calculate live statistics
  const currentMonthCount = 128; // Month total
  const finishedCount = 104; // 81.2%
  const pendingReviewCount = applications.filter(a => a.status === '待审批').length;
  const inProgressCount = applications.filter(a => a.status === '待受理' || a.status === '开具中').length;
  const avgProcessDays = 1.2; // 1.2 days

  // Disaster types breakdown
  const disasterTypes = [
    { label: '暴雨洪涝', percent: 46, color: 'bg-blue-600' },
    { label: '雷暴大风', percent: 28, color: 'bg-cyan-500' },
    { label: '冰雹灾害', percent: 12, color: 'bg-indigo-600' },
    { label: '高温干旱', percent: 9, color: 'bg-amber-500' },
    { label: '低温冻害/其他', percent: 5, color: 'bg-slate-400' },
  ];

  // District distribution
  const districts = [
    { name: '随县', count: 58, percent: 45, note: '以食用菌大棚、水稻旱涝指数保险核灾为主' },
    { name: '曾都区', count: 44, percent: 34, note: '以城市短时暴雨积涝、机动车涉水理赔为主' },
    { name: '广水市', count: 26, percent: 21, note: '以光伏风电清洁能源、果林冰雹风灾为主' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 4 Metric Cards in Elegant Dark Archetype */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: 本月申请总数 */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-100 hover:shadow-sm transition">
          <p className="text-xs text-slate-500 mb-1">本月申请总数</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{currentMonthCount}</h3>
            <span className="text-xs text-emerald-500 font-bold">+12% ↑</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">随县与曾都区季节性暴雨申报明显增多</p>
        </div>

        {/* Metric 2: 已办结证明 */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-100 hover:shadow-sm transition">
          <p className="text-xs text-slate-500 mb-1">已办结证明</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{finishedCount}</h3>
            <span className="text-xs text-emerald-500 font-bold">81.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">红头公文电子签章出具，送达率 100%</p>
        </div>

        {/* Metric 3: 平均办理天数 */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-100 hover:shadow-sm transition">
          <p className="text-xs text-slate-500 mb-1">平均办理天数</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{avgProcessDays}</h3>
            <span className="text-xs text-blue-500 font-bold">天</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">承诺时限3个工作日，提速 60%</p>
        </div>

        {/* Metric 4: 待审批任务 (Highlight Gradient Card) */}
        <div className="p-5 rounded-xl shadow-xs border border-slate-100 bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:shadow-md transition">
          <p className="text-xs opacity-80 mb-1">待审批与在办任务</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono">
              {String(pendingReviewCount + inProgressCount).padStart(2, '0')}
            </h3>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded font-medium">
              待审 {pendingReviewCount} 件
            </span>
          </div>
          <p className="text-[11px] text-blue-100/80 mt-2">经办岗起草完结，呈报局机关审批</p>
        </div>

      </section>

      {/* Main Row: Chart Card + Dark System Status Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 近6个月申请趋势柱状图 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                申请与办结趋势 (近6个月)
              </h4>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span>
                  <span className="text-slate-500">当月申请量</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-slate-200 rounded-xs"></span>
                  <span className="text-slate-500">已签发办结</span>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="pt-8 pb-4">
              <div className="h-44 flex items-end justify-between gap-4 px-3 border-b border-slate-100 relative">
                
                {MONTHLY_STATS.map((m, idx) => {
                  const applyHeight = Math.round((m.count / 65) * 100);
                  const isLast = idx === MONTHLY_STATS.length - 1;

                  return (
                    <div
                      key={m.month}
                      onMouseEnter={() => setHoveredMonth(m)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-10 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {m.month}：申请 {m.count} 件，办结 {m.finished} 件
                      </div>

                      {/* Bar Pillar */}
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${applyHeight}%` }}
                          className={`w-5 sm:w-8 rounded-t transition-all duration-300 ${
                            isLast ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-blue-400'
                          }`}
                        ></div>
                      </div>

                      {/* Month Label */}
                      <span className={`mt-2 text-xs ${isLast ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                        {m.month.split('-')[1]}月
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>主汛期（6~8月）强对流、暴雨证明业务占全年 58.4%</span>
            <span className="text-blue-600 font-medium">气象证明数据自动化核验</span>
          </div>
        </div>

        {/* Right 1 Col: Elegant Dark System Dynamics Widget */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative flex flex-col justify-between border border-slate-800">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                系统动态与专网状态
              </h4>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-blue-200 font-mono">
                实时运行
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0"></div>
                <div>
                  <p className="text-xs font-medium text-slate-200">[系统] 随州国家基本站(57476)分钟数据正常接入</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">全域70个区域自动气象站数据链路畅通</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                <div>
                  <p className="text-xs font-medium text-slate-200">[认证] 电子公章与防伪验真证书校验有效</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">算法符合《中华人民共和国电子签名法》要求</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-400 shrink-0"></div>
                <div>
                  <p className="text-xs font-medium text-slate-200">[同步] 随州市大数据中心政务共享接口已更新</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">银行保险核灾部门可直接在线查验回执</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>安全级别：等保二级</span>
            <span className="text-emerald-400 font-mono">100% 在线</span>
          </div>

          {/* Ambient Blue Radial Glow from Elegant Dark template */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
        </div>

      </section>

      {/* Two Secondary Analytics Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Disaster Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              气象灾害种类申请构成比例
            </h4>
            <span className="text-xs text-slate-400">近12个月受理数据</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {disasterTypes.map((d) => (
              <div key={d.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{d.label}</span>
                  <span className="font-bold text-slate-900 font-mono">{d.percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-500`}
                    style={{ width: `${d.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            注：暴雨洪涝占比居首（46%），主要涉及农业种植险、水产养殖及厂房财产损失理赔。
          </p>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
              县市区业务分布情况
            </h4>
            <span className="text-xs text-slate-400">随州市三区市县</span>
          </div>

          <div className="space-y-3">
            {districts.map((dist) => (
              <div key={dist.name} className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span>{dist.name}</span>
                    <span className="text-[11px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-medium">
                      占比 {dist.percent}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {dist.note}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-800 font-mono">{dist.count}</span>
                  <span className="text-[11px] text-slate-400 ml-0.5">件</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
            <span>支撑机构：随州市气象台</span>
            <span className="text-emerald-600 font-medium">测站数据全自动化校验</span>
          </div>
        </div>

      </section>

    </div>
  );
};
