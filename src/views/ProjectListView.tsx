import React from 'react';
import { MousePointerClick, PhoneCall, BarChart2 } from 'lucide-react';

export const ProjectListView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f6f6] min-h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">实战项目中心</h2>
          <p className="text-slate-500 mt-2">基于真实脱敏数据的商业分析沙盘，从手工处理升级到自动建模。</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-[#ec5b13] text-white rounded-xl text-xs font-bold cursor-pointer">全部领域</span>
          <span className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">零售/电商</span>
          <span className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">政务/民生</span>
          <span className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">金融/咨询</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Project 1 */}
        <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="h-32 bg-gradient-to-br from-orange-400 to-[#ec5b13] p-6 relative">
            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">L1 基础篇</span>
            <MousePointerClick className="text-white text-5xl opacity-40" size={48} />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-green-100 text-green-700 uppercase">引导式</span>
              <span className="text-slate-400 text-[10px]">1,200 Rows</span>
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#ec5b13] transition-colors">全渠道投放 ROI 自动核算</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">批量核算不同渠道的投放成本与产出，自动生成 ROI 排名，告别繁琐的 Excel 粘贴。</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">Dict</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">Loops</span>
            </div>
            <button onClick={() => onNavigate('workspace')} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-[#ec5b13] transition-all">开启实战</button>
          </div>
        </div>

        {/* Project 2 */}
        <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="h-32 bg-gradient-to-br from-[#0f4c81] to-[#0a3a63] p-6 relative">
            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">L2 进阶篇</span>
            <PhoneCall className="text-white text-5xl opacity-40" size={48} />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-amber-100 text-amber-700 uppercase">挑战式</span>
              <span className="text-slate-400 text-[10px]">85,000 Rows</span>
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#0f4c81] transition-colors">12345 服务高峰预测建模</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">利用时间序列分析处理热线接听记录，识别流量高峰并预测下周席位需求。</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">Pandas</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">TS-Model</span>
            </div>
            <button onClick={() => onNavigate('workspace')} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-[#0f4c81] transition-all">接受挑战</button>
          </div>
        </div>

        {/* Project 3 */}
        <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-900 p-6 relative">
            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">L3 实战篇</span>
            <BarChart2 className="text-white text-5xl opacity-40" size={48} />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold py-0.5 px-2 rounded bg-green-100 text-green-700 uppercase">引导式</span>
              <span className="text-slate-400 text-[10px]">15万+ Rows</span>
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-slate-700 transition-colors">用户留存 Cohort Analysis 矩阵</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">通过订单流水挖掘用户的月度留存率，定位高价值忠诚用户群体的行为共性。</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">Matrix</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">Seaborn</span>
            </div>
            <button onClick={() => onNavigate('workspace')} className="w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all">进入实战</button>
          </div>
        </div>
      </div>
    </div>
  );
};
