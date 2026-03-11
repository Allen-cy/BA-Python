import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: string) => void;
  user: any;
  onSignOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, user, onSignOut, isAuthenticated }) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#ec5b13] uppercase">本周目标完成度</span>
            <span className="text-xs font-bold text-slate-600">65%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#ec5b13]" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <Bell size={20} />
        </button>
        <div className="h-8 w-[1px] bg-slate-200"></div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
             <div 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#ec5b13] transition-colors">
                  {user?.display_name || '学员'}
                </p>
                <p className="text-[10px] text-slate-500">商业分析师</p>
              </div>
              <img
                src={user?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            </div>
            <button 
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="登出"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-bold text-[#ec5b13]"
          >
            游客模式
          </button>
        )}
      </div>
    </header>
  );
};
