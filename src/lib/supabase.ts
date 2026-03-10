/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Supabase 客户端配置
// 环境变量通过 Vite 的 import.meta.env 读取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase 配置缺失，请在 .env.local 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
