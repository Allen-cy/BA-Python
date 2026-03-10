import React from 'react';
import {
  BarChart,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  Clock,
  Database,
  Check,
  Play,
  Lock,
  Bell,
  Users,
  BarChart2,
} from 'lucide-react';
import type { CourseWithProgress, User } from '../types';

interface DashboardViewProps {
  onNavigate: () => void;
  courses: CourseWithProgress[];
  user: User | null;
  totalProgress: number;
  onSignOut?: () => void;
}

// 仪表盘视图
const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  courses,
  user,
  totalProgress,
  onSignOut,
}) => {
  // 获取课程状态的图标和样式
  const getStageStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          iconBg: 'bg-green-500',
          ring: 'ring-8 ring-green-50',
          icon: <Check size={32} strokeWidth={3} />,
          badge: { bg: 'bg-green-100 text-green-700', text: '已完成' },
          cardBorder: 'border border-slate-200 shadow-sm hover:shadow-md',
          wrapper: '',
        };
      case 'in_progress':
        return {
          iconBg: 'bg-[#0f4c81]',
          ring: 'ring-8 ring-[#0f4c81]/20',
          icon: <Play size={32} fill="currentColor" />,
          badge: { bg: 'bg-[#0f4c81]/10 text-[#0f4c81]', text: '进行中' },
          cardBorder: 'border-2 border-[#0f4c81] shadow-xl shadow-[#0f4c81]/5',
          wrapper: '',
        };
      default:
        return {
          iconBg: 'bg-slate-200',
          ring: '',
          icon: <Lock size={28} />,
          badge: { bg: 'bg-slate-100 text-slate-500', text: '未解锁' },
          cardBorder: 'border border-slate-200',
          wrapper: 'grayscale opacity-60',
        };
    }
  };

  // 获取课程的标签图标
  const getTagIcon = (course: CourseWithProgress) => {
    if (course.stage_number === 1) return <Database size={14} />;
    if (course.stage_number === 2) return <BookOpen size={14} />;
    if (course.stage_number === 3) return <BarChart2 size={14} />;
    return <Users size={14} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] text-slate-900 font-sans">
      {/* 侧边栏 */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f4c81] rounded-xl flex items-center justify-center text-white">
            <BarChart size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">BA-Python</h1>
            <p className="text-xs text-slate-500 mt-1">商业分析实战</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#0f4c81]/10 text-[#0f4c81] rounded-xl font-medium">
            <LayoutDashboard size={20} />
            <span>仪表盘</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <BookOpen size={20} />
            <span>课程目录</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <MessageSquare size={20} />
            <span>社区问答</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Settings size={20} />
            <span>个人中心</span>
          </a>
        </nav>
        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <img
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
            />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate">{user?.display_name || '访客'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role === 'instructor' ? '课程讲师' : '初级商业分析师'}</p>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                title="退出登录"
              >
                退出
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* 顶部导航栏 */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#0f4c81] uppercase">总学习进度</span>
                <span className="text-xs font-bold text-slate-600">{totalProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0f4c81] transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
              <Bell size={20} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200" />
            <button
              onClick={onNavigate}
              className="bg-[#0f4c81] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#0f4c81]/20 hover:opacity-90 transition-opacity"
            >
              继续学习
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight">我的学习路线图</h2>
            <p className="text-slate-500 mt-2">基于真实业务场景，从零构建 Python 商业分析能力</p>
          </div>

          <div className="relative space-y-0">
            {/* 路径线 */}
            <div
              className="absolute left-8 top-10 bottom-10 w-0.5 z-0"
              style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, #dee2e6 50%)', backgroundSize: '2px 20px' }}
            />

            {/* 动态渲染课程阶段 */}
            {courses.map((course, index) => {
              const style = getStageStyle(course.status);
              const isLast = index === courses.length - 1;

              return (
                <div
                  key={course.id}
                  className={`relative z-10 flex gap-10 ${!isLast ? 'pb-16' : ''} ${style.wrapper}`}
                >
                  <div className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center text-${course.status === 'locked' ? 'slate-500' : 'white'} ${style.ring} flex-shrink-0 ${course.status === 'in_progress' ? 'animate-pulse' : ''}`}>
                    {style.icon}
                  </div>
                  <div className={`flex-1 bg-white p-6 rounded-2xl ${style.cardBorder} transition-shadow`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">阶段 {course.stage_number}: {course.title}</h3>
                      <span className={`${style.badge.bg} text-xs px-2 py-1 rounded font-bold uppercase`}>
                        {style.badge.text}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {course.duration_hours} 小时
                        </span>
                        <span className="flex items-center gap-1">
                          {getTagIcon(course)} {course.tags}
                        </span>
                      </div>
                      {course.status === 'in_progress' && (
                        <button
                          onClick={onNavigate}
                          className="bg-[#0f4c81] text-white text-sm px-5 py-2 rounded-lg font-bold hover:bg-[#0a365c] transition-colors"
                        >
                          继续当前课程
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部 */}
        <footer className="mt-auto border-t border-slate-200 p-8 bg-slate-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-bold text-slate-900">需要帮助？</p>
              <p className="text-sm text-slate-500 mt-1">我们的课程导师 24/7 为您解答 Python 商业分析难题。</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">联系导师</button>
              <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">下载学习资料</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DashboardView;
