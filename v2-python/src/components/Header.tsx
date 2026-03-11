import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#0f4c81] uppercase">总学习进度</span>
            <span className="text-xs font-bold text-slate-600">35%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#0f4c81]" style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <Bell size={20} />
        </button>
        <div className="h-8 w-[1px] bg-slate-200"></div>
        <button
          onClick={() => onNavigate('workspace')}
          className="bg-[#0f4c81] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#0f4c81]/20 hover:opacity-90 transition-opacity"
        >
          继续学习
        </button>
      </div>
    </header>
  );
};
