import React from 'react';
import { Calculator, Lock, PlayCircle, Database } from 'lucide-react';

export const DashboardView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">BA 专项 Python 修炼路径</h2>
        <p className="text-slate-500 mt-3">从业务视角出发，跳过繁琐开发语法，直达数据决策核心。</p>
      </div>

      <div className="space-y-6">
        {/* Stage 1 */}
        <div className="relative group">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#0f4c81] rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0f4c81]">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">阶段 1：商业指标自动化计算</h3>
                  <p className="text-sm text-slate-500">掌握变量、循环与基础逻辑，实现 ROI、转化率的批量核算。</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">已开启</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate('workspace')}
                className="group/card bg-white p-4 rounded-xl border border-slate-200 hover:border-[#ec5b13] cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-mono">1.1</span>
                  <PlayCircle size={18} className="text-slate-300 group-hover/card:text-[#ec5b13] transition-colors" />
                </div>
                <h4 className="font-bold text-sm mt-2">变量与基础逻辑：ROI 计算器</h4>
                <p className="text-xs text-slate-500 mt-1">学会用 Python 处理 Excel 难以胜任的多维公式嵌套。</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-transparent text-slate-600 cursor-pointer hover:border-[#0f4c81] transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-mono">1.2</span>
                </div>
                <h4 className="font-bold text-sm mt-2">多维度渠道 ROI 排序</h4>
                <p className="text-xs text-slate-500 mt-1">自动过滤低效渠道，输出全渠道 ROI 排名。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="relative group opacity-60">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-slate-200 rounded-full"></div>
          <div className="bg-white/60 p-6 rounded-2xl border border-dashed border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-400">阶段 2：Pandas 脏数据清洗实战</h3>
                  <p className="text-sm text-slate-400">处理 Excel 无法处理的百万级数据，解决缺失值、去重与格式对齐。</p>
                </div>
              </div>
              <Lock size={20} className="text-slate-300" />
            </div>
            <p className="text-xs text-slate-400 mt-4 ml-16">需要完成阶段 1 所有练习后解锁。掌握百万级数据的清洗与合并。</p>
          </div>
        </div>
      </div>
    </div>
  );
};
