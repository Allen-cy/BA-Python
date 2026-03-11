import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Code2, Database, CheckCircle2 } from 'lucide-react';

export const PersonalCenterView = () => {
  const userSkills = [
    { subject: '数据清洗', A: 65, fullMark: 100 },
    { subject: '统计分析', A: 40, fullMark: 100 },
    { subject: '数据可视化', A: 55, fullMark: 100 },
    { subject: '业务逻辑', A: 80, fullMark: 100 },
    { subject: '自动化', A: 30, fullMark: 100 },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">个人中心</h2>
        <p className="text-slate-500 mt-2">查看您的 BA 能力画像与学习成果。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Snippets */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0f4c81]">
                <Code2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">执行代码次数</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#ec5b13]">
                <Database size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">处理数据量</p>
                <p className="text-2xl font-bold">2.4M 行</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">完成业务案例</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          {/* Snippets */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">成果仓库 (Snippets)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">多渠道 ROI 计算</span>
                  <span className="text-xs text-slate-400">阶段 1.1</span>
                </div>
                <pre className="text-xs text-slate-600 font-mono bg-slate-100 p-2 rounded overflow-x-auto">
                  {`for item in campaign_data:\n  roi = item['revenue'] / item['cost']\n  if roi > best_roi:\n    best_roi = roi\n    best_channel = item['channel']`}
                </pre>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">Pandas 缺失值处理</span>
                  <span className="text-xs text-slate-400">阶段 2.3</span>
                </div>
                <pre className="text-xs text-slate-600 font-mono bg-slate-100 p-2 rounded overflow-x-auto">
                  {`df_clean = df.dropna(subset=['customer_id'])\ndf_clean['amount'] = df_clean['amount'].fillna(0)`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-center">BA 能力雷达图</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={userSkills}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="BA 能力"
                  dataKey="A"
                  stroke="#ec5b13"
                  fill="rgba(236, 91, 19, 0.2)"
                  fillOpacity={1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            基于您完成的实战项目动态评估
          </div>
        </div>
      </div>
    </div>
  );
};
