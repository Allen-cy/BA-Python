import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerSupabase, getUser } from '../_lib/supabase.js';

// GET /api/progress - 获取用户所有进度
// POST /api/progress - 创建/更新进度
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 验证用户身份
  const user = await getUser(req.headers.authorization || null);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', data: null });
  }

  const supabase = createServerSupabase();

  try {
    if (req.method === 'GET') {
      // 获取用户所有课程进度
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message, data: null });
      }

      return res.status(200).json({ data, error: null });
    }

    if (req.method === 'POST') {
      const { course_id, lesson_id, status, progress_percent, code_snapshot } = req.body;

      if (!course_id) {
        return res.status(400).json({ error: 'course_id is required', data: null });
      }

      // Upsert 进度（基于 user_id + course_id 唯一约束）
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            course_id,
            lesson_id: lesson_id || null,
            status: status || 'in_progress',
            progress_percent: progress_percent || 0,
            code_snapshot: code_snapshot || null,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,course_id',
          }
        )
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message, data: null });
      }

      return res.status(200).json({ data, error: null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Progress API error:', err);
    return res.status(500).json({ error: 'Internal server error', data: null });
  }
}
