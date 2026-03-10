import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerSupabase } from '../_lib/supabase.js';

// GET /api/courses/[id] - 获取单个课程详情（含课节列表）
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Course ID is required', data: null });
  }

  try {
    const supabase = createServerSupabase();

    // 获取课程信息
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found', data: null });
    }

    // 获取课程下的所有课节
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('sort_order', { ascending: true });

    if (lessonsError) {
      return res.status(500).json({ error: lessonsError.message, data: null });
    }

    return res.status(200).json({
      data: {
        ...course,
        lessons: lessons || [],
      },
      error: null,
    });
  } catch (err) {
    console.error('Course detail API error:', err);
    return res.status(500).json({ error: 'Internal server error', data: null });
  }
}
