import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServerSupabase, getUser } from '../_lib/supabase.js';

// GET /api/courses - 获取课程列表（含用户进度）
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createServerSupabase();

    // 获取所有课程
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('stage_number', { ascending: true });

    if (coursesError) {
      return res.status(500).json({ error: coursesError.message, data: null });
    }

    // 尝试获取用户进度
    const user = await getUser(req.headers.authorization || null);
    let progressMap: Record<string, { status: string; progress_percent: number }> = {};

    if (user) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('course_id, status, progress_percent')
        .eq('user_id', user.id);

      if (progress) {
        progressMap = progress.reduce((acc, p) => {
          acc[p.course_id] = { status: p.status, progress_percent: p.progress_percent };
          return acc;
        }, {} as Record<string, { status: string; progress_percent: number }>);
      }
    }

    // 合并课程与进度数据
    const coursesWithProgress = courses?.map((course, index) => {
      const userProgress = progressMap[course.id];
      let status: string;
      let progressPercent: number;

      if (userProgress) {
        status = userProgress.status;
        progressPercent = userProgress.progress_percent;
      } else if (index === 0) {
        // 第一个课程默认已完成（演示用）
        status = 'completed';
        progressPercent = 100;
      } else if (index === 1) {
        // 第二个课程默认进行中
        status = 'in_progress';
        progressPercent = 65;
      } else {
        status = 'locked';
        progressPercent = 0;
      }

      return {
        ...course,
        status,
        progress_percent: progressPercent,
      };
    });

    return res.status(200).json({ data: coursesWithProgress, error: null });
  } catch (err) {
    console.error('Courses API error:', err);
    return res.status(500).json({ error: 'Internal server error', data: null });
  }
}
