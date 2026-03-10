import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerSupabase, getUser } from '../_lib/supabase.js';

// POST /api/submissions - 提交代码
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const user = await getUser(req.headers.authorization || null);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', data: null });
  }

  const supabase = createServerSupabase();

  try {
    if (req.method === 'POST') {
      const { lesson_id, code, output, is_passed } = req.body;

      if (!lesson_id || !code) {
        return res.status(400).json({ error: 'lesson_id and code are required', data: null });
      }

      const { data, error } = await supabase
        .from('code_submissions')
        .insert({
          user_id: user.id,
          lesson_id,
          code,
          output: output || null,
          is_passed: is_passed || false,
          feedback: null,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message, data: null });
      }

      return res.status(201).json({ data, error: null });
    }

    if (req.method === 'GET') {
      const { lesson_id } = req.query;

      const query = supabase
        .from('code_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (lesson_id && typeof lesson_id === 'string') {
        query.eq('lesson_id', lesson_id);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        return res.status(500).json({ error: error.message, data: null });
      }

      return res.status(200).json({ data, error: null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Submissions API error:', err);
    return res.status(500).json({ error: 'Internal server error', data: null });
  }
}
