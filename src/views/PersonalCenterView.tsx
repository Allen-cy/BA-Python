import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Code2, Database, CheckCircle2, User as UserIcon, LogOut, Mail, Loader2 } from 'lucide-react';
import { useUserStats } from '../hooks/useUserStats';

interface PersonalCenterViewProps {
  user: any;
  onSignOut: () => Promise<void>;
}

export const PersonalCenterView: React.FC<PersonalCenterViewProps> = ({ user, onSignOut }) => {
  const { stats, loading: statsLoading } = useUserStats(user?.id);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={user?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"} 
              alt="Avatar" 
              className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-slate-50 w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.display_name || '学员'}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Mail size={14} /> {user?.email || '未登录'}
              </span>
              <span className="bg-orange-100 text-[#ec5b13] px-2 py-0.5 rounded text-[10px] font-bold uppercase">商业分析师 L2</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onSignOut}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Snippets */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0f4c81]">
                <Code2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">代码总提交</p>
                <p className="text-2xl font-bold">124</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ec5b13]">
                <Database size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">数据吞吐量</p>
                <p className="text-2xl font-bold">540 KB</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">通关案例数</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>

          {/* Snippets */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">代码作品集 (Snippets)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">业务指标 ROI 计算封装</span>
                  <span className="text-xs text-slate-400">2026-03-05</span>
                </div>
                <pre className="text-xs text-slate-600 font-mono bg-slate-100 p-3 rounded-lg overflow-x-auto">
                  {`def calculate_roi(rev, cost):\n    return (rev - cost) / cost\n\nresults = [calculate_roi(r, c) for r, c in raw_data]`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Radar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
          <h3 className="text-lg font-bold mb-6 text-center">BA 能力画像</h3>
          
          {statsLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-orange-500 mb-2" />
              <p className="text-xs text-slate-400 font-medium">分析数据中...</p>
            </div>
          )}

          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="BA 能力"
                  dataKey="A"
                  stroke="#ec5b13"
                  fill="rgba(236, 91, 19, 0.2)"
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 leading-relaxed px-4">
            该评估基于您的代码正确率、业务逻辑处理速度以及自动化方案的覆盖度实时生成。
          </p>
        </div>
      </div>
    </div>
  );
};
