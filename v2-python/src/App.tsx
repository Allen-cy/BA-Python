import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { ProjectListView } from './views/ProjectListView';
import { PersonalCenterView } from './views/PersonalCenterView';
import { WorkspaceView } from './views/WorkspaceView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  // Workspace is a full-screen view without the main sidebar/header
  if (currentView === 'workspace') {
    return <WorkspaceView onNavigate={handleNavigate} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] text-slate-900 font-sans">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        <Header onNavigate={handleNavigate} />
        
        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentView === 'projects' && <ProjectListView onNavigate={handleNavigate} />}
          {currentView === 'profile' && <PersonalCenterView />}
          {currentView === 'community' && (
            <div className="p-8 max-w-5xl mx-auto w-full text-center mt-20">
              <h2 className="text-2xl font-bold text-slate-700">社区问答正在建设中...</h2>
              <p className="text-slate-500 mt-2">敬请期待更多精彩内容</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
