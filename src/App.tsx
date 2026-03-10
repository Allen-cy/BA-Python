import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCourses } from './hooks/useCourses';
import { useProgress } from './hooks/useProgress';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import WorkspaceView from './components/WorkspaceView';

// 应用视图类型
type AppView = 'login' | 'dashboard' | 'workspace';

export default function App() {
  const [view, setView] = useState<AppView>('login');
  const { user, loading: authLoading, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const { courses, currentLesson, loading: coursesLoading, fetchLesson } = useCourses();
  const { submitCode, getTotalProgress, fetchProgress } = useProgress();

  // 当用户认证状态变化时，切换视图
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && view === 'login') {
        setView('dashboard');
        fetchProgress();
      }
    }
  }, [isAuthenticated, authLoading, view, fetchProgress]);

  // 登录处理
  const handleLogin = useCallback(async (email: string, password: string) => {
    await signIn(email, password);
    setView('dashboard');
  }, [signIn]);

  // 注册处理
  const handleSignUp = useCallback(async (email: string, password: string, displayName: string) => {
    await signUp(email, password, displayName);
    setView('dashboard');
  }, [signUp]);

  // 跳过登录（演示模式）
  const handleSkip = useCallback(() => {
    setView('dashboard');
  }, []);

  // 退出登录
  const handleSignOut = useCallback(async () => {
    await signOut();
    setView('login');
  }, [signOut]);

  // 导航到工作台
  const handleGoToWorkspace = useCallback(async () => {
    // 查找当前进行中的课程
    const inProgressCourse = courses.find(c => c.status === 'in_progress');
    if (inProgressCourse) {
      await fetchLesson(inProgressCourse.id);
    }
    setView('workspace');
  }, [courses, fetchLesson]);

  // 返回仪表盘
  const handleGoToDashboard = useCallback(() => {
    setView('dashboard');
  }, []);

  // 提交代码
  const handleSubmitCode = useCallback(async (
    lessonId: string,
    code: string,
    output: string,
    isPassed: boolean
  ) => {
    await submitCode(lessonId, code, output, isPassed);
  }, [submitCode]);

  // 计算总进度
  const totalProgress = courses.length > 0
    ? Math.round(
        courses.reduce((sum, c) => sum + c.progress_percent, 0) / courses.length
      )
    : 35;

  // 认证加载中
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f4c81] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  // 课程数据加载中
  if (view !== 'login' && coursesLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0f4c81]/20 border-t-[#0f4c81] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">加载课程数据...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'login' && (
        <LoginView
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onSkip={handleSkip}
          loading={authLoading}
        />
      )}
      {view === 'dashboard' && (
        <DashboardView
          onNavigate={handleGoToWorkspace}
          courses={courses}
          user={user}
          totalProgress={totalProgress}
          onSignOut={isAuthenticated ? handleSignOut : undefined}
        />
      )}
      {view === 'workspace' && (
        <WorkspaceView
          onNavigate={handleGoToDashboard}
          lesson={currentLesson}
          user={user}
          onSubmitCode={handleSubmitCode}
        />
      )}
    </>
  );
}
