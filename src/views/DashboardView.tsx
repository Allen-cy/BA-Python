import React from 'react';
import { Calculator, Lock, PlayCircle, Database, BarChart2, Users, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onStartCourse: (courseId: string) => void;
  courses: any[];
  loading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onStartCourse, courses, loading }) => {
  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#ec5b13]/20 border-t-[#ec5b13] rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">正在加载专属修炼路径...</p>
      </div>
    );
  }

  // Map icon strings to components
  const getIcon = (type: string) => {
    switch (type) {
      case 'calculator': return <Calculator size={24} />;
      case 'table': return <Database size={24} />;
      case 'bar-chart': return <BarChart2 size={24} />;
      case 'users': return <Users size={24} />;
      default: return <Calculator size={24} />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">BA 专项 Python 修炼路径</h2>
        <p className="text-slate-500 mt-3">从业务视角出发，跳过繁琐开发语法，直达数据决策核心。</p>
      </div>

      <div className="space-y-8 pb-20">
        {courses.map((course, idx) => {
          const isLocked = course.status === 'not_started' && idx > 0 && courses[idx-1].status !== 'completed';
          const isCompleted = course.status === 'completed';
          
          return (
            <div key={course.id} className={`relative group ${isLocked ? 'opacity-50' : ''}`}>
              <div className={`absolute -left-4 top-0 bottom-0 w-1 rounded-full transition-opacity ${
                isLocked ? 'bg-slate-200' : 'bg-[#ec5b13] opacity-20 group-hover:opacity-100'
              }`}></div>
              
              <div className={`bg-white p-6 rounded-2xl border ${
                isLocked ? 'border-dashed border-slate-200' : 'border-slate-200 shadow-sm hover:shadow-md'
              } transition-shadow`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isLocked ? 'bg-slate-100 text-slate-400' : 'bg-orange-50 text-[#ec5b13]'
                    }`}>
                      {getIcon(course.icon_type)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                        阶段 {course.stage_number}：{course.title}
                      </h3>
                      <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                        {course.description}
                      </p>
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <Lock size={20} className="text-slate-300" />
                  ) : isCompleted ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle size={20} fill="currentColor" className="text-white" />
                      <span className="text-xs font-bold">已通关</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#ec5b13] bg-orange-50 px-2 py-1 rounded">进行中</span>
                  )}
                </div>

                {!isLocked && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => onStartCourse(course.id)}
                      className="group/card bg-white p-4 rounded-xl border border-slate-200 hover:border-[#ec5b13] cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 font-mono">{course.stage_number}.1</span>
                        <PlayCircle size={18} className="text-slate-300 group-hover/card:text-[#ec5b13] transition-colors" />
                      </div>
                      <h4 className="font-bold text-sm mt-2">核心训练：{course.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">开始实战演练，利用 Python 解决商业痛点。</p>
                    </div>
                  </div>
                )}
                
                {isLocked && (
                  <p className="text-xs text-slate-400 mt-4 ml-16 italic">
                    前序课程尚未完成，努力提升能力值以解锁。
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
