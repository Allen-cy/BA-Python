import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerSupabase } from '../_lib/supabase.js';

// GET /api/lessons/[id] - 获取单个课节详情
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
    return res.status(400).json({ error: 'Lesson ID is required', data: null });
  }

  try {
    const supabase = createServerSupabase();

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        courses (
          id,
          title,
          stage_number
        )
      `)
      .eq('id', id)
      .single();

    if (error || !lesson) {
      return res.status(404).json({ error: 'Lesson not found', data: null });
    }

    return res.status(200).json({ data: lesson, error: null });
  } catch (err) {
    console.error('Lesson API error:', err);
    return res.status(500).json({ error: 'Internal server error', data: null });
  }
}
