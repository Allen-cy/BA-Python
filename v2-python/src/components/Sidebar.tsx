import React from 'react';
import { BarChart, LayoutDashboard, BookOpen, MessageSquare, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: '课程控制台', icon: LayoutDashboard },
    { id: 'projects', label: '项目列表', icon: BookOpen },
    { id: 'community', label: '社区问答', icon: MessageSquare },
    { id: 'profile', label: '个人中心', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
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
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-[#0f4c81]/10 text-[#0f4c81]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <img
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-slate-200 object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">王经理</p>
            <p className="text-xs text-slate-500 truncate">初级商业分析师</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
