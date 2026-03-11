import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCourses } from './hooks/useCourses';
import { useProgress } from './hooks/useProgress';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { ProjectListView } from './views/ProjectListView';
import { PersonalCenterView } from './views/PersonalCenterView';
import { WorkspaceView } from './views/WorkspaceView';
import LoginView from './views/LoginView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showDemo, setShowDemo] = useState(false);
  
  const { user, loading: authLoading, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const { courses, loading: coursesLoading, fetchLesson, currentLesson } = useCourses();
  const { fetchProgress, submitCode } = useProgress();

  // Navigation handler
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  // Start course handler
  const handleStartCourse = async (courseId: string) => {
    await fetchLesson(courseId);
    setCurrentView('workspace');
  };

  // Auth Effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    }
  }, [isAuthenticated, fetchProgress]);

  // Login Handlers
  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    await signUp(email, password, displayName);
  };

  const handleSkip = () => {
    setShowDemo(true);
  };

  // Sign out handler (passed via props)
  const handleSignOut = async () => {
    await signOut();
    setShowDemo(false);
  };

  // Render Login if not authenticated and not in demo mode
  if (!isAuthenticated && !showDemo && !authLoading) {
    return (
      <LoginView 
        onLogin={handleLogin} 
        onSignUp={handleSignUp} 
        onSkip={handleSkip} 
        loading={authLoading}
      />
    );
  }

  // Loading States
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ec5b13]/20 border-t-[#ec5b13] rounded-full animate-spin" />
      </div>
    );
  }

  // Workspace is a full-screen view
  if (currentView === 'workspace') {
    return (
      <WorkspaceView 
        onNavigate={handleNavigate} 
        lesson={currentLesson}
        user={user}
        onSubmitCode={submitCode}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] text-slate-900 font-sans">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        <Header 
          onNavigate={handleNavigate} 
          user={user} 
          onSignOut={handleSignOut}
          isAuthenticated={isAuthenticated}
        />
        
        <main className="flex-1">
          {currentView === 'dashboard' && (
            <DashboardView 
              onNavigate={handleNavigate} 
              onStartCourse={handleStartCourse}
              courses={courses}
              loading={coursesLoading}
            />
          )}
          {currentView === 'projects' && (
            <ProjectListView onNavigate={handleNavigate} />
          )}
          {currentView === 'profile' && (
            <PersonalCenterView user={user} onSignOut={handleSignOut} />
          )}
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
