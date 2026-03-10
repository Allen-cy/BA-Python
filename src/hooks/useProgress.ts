import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProgress } from '../types';

// 用户进度管理 Hook
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取用户的所有学习进度
  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setProgress([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      console.error('Fetch progress error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新进度
  const updateProgress = useCallback(async (
    courseId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    progressPercent: number,
    codeSnapshot?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: session.user.id,
            course_id: courseId,
            status,
            progress_percent: progressPercent,
            code_snapshot: codeSnapshot || null,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,course_id' }
        )
        .select()
        .single();

      if (error) throw error;
      
      // 更新本地状态
      setProgress(prev => {
        const idx = prev.findIndex(p => p.course_id === courseId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data;
          return updated;
        }
        return [...prev, data];
      });

      return data;
    } catch (err) {
      console.error('Update progress error:', err);
      return null;
    }
  }, []);

  // 提交代码
  const submitCode = useCallback(async (
    lessonId: string,
    code: string,
    output: string,
    isPassed: boolean
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('code_submissions')
        .insert({
          user_id: session.user.id,
          lesson_id: lessonId,
          code,
          output,
          is_passed: isPassed,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Submit code error:', err);
      return null;
    }
  }, []);

  // 计算总进度百分比
  const getTotalProgress = useCallback((totalCourses: number) => {
    if (totalCourses === 0) return 0;
    const completedCount = progress.filter(p => p.status === 'completed').length;
    const inProgressPercent = progress
      .filter(p => p.status === 'in_progress')
      .reduce((sum, p) => sum + p.progress_percent, 0);
    
    return Math.round(
      ((completedCount * 100 + inProgressPercent) / (totalCourses * 100)) * 100
    );
  }, [progress]);

  return {
    progress,
    loading,
    fetchProgress,
    updateProgress,
    submitCode,
    getTotalProgress,
  };
}
