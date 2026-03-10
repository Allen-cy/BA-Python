import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

// 认证状态管理 Hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化：检查当前会话
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // 获取 profile 信息
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profile ? {
            id: session.user.id,
            email: session.user.email || '',
            display_name: profile.display_name || '学员',
            avatar_url: profile.avatar_url,
            role: profile.role || 'student',
            created_at: profile.created_at,
          } : null);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profile ? {
            id: session.user.id,
            email: session.user.email || '',
            display_name: profile.display_name || '学员',
            avatar_url: profile.avatar_url,
            role: profile.role || 'student',
            created_at: profile.created_at,
          } : null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 登录
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  // 注册
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  // 登出
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // 获取当前 session token（用于 API 调用）
  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getToken,
    isAuthenticated: !!user,
  };
}
