import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SkillStat {
  subject: string;
  A: number;
}

export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<SkillStat[]>([
    { subject: 'Python 基础', A: 20 },
    { subject: '数据清洗', A: 20 },
    { subject: '指标建模', A: 20 },
    { subject: '可视化分析', A: 20 },
    { subject: '业务增长', A: 20 }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    
    try {
      // 1. 获取用户进度
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select(`
          status,
          courses (
            tags
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // 2. 初始化分数
      const scores: Record<string, number> = {
        'Python 基础': 20,
        '数据清洗': 20,
        '指标建模': 20,
        '可视化分析': 20,
        '业务增长': 20
      };

      // 3. 根据标签增加分数 (每个已完成课程 + 20 分)
      progress?.forEach(p => {
        if (p.status === 'completed') {
          const tags = (p.courses as any)?.tags?.split(' ') || [];
          tags.forEach((tag: string) => {
            if (tag.includes('Python')) scores['Python 基础'] += 20;
            if (tag.includes('Pandas')) scores['数据清洗'] += 20;
            if (tag.includes('ROI')) scores['指标建模'] += 20;
            if (tag.includes('可视化')) scores['可视化分析'] += 20;
            if (tag.includes('增长')) scores['业务增长'] += 20;
            if (tag.includes('RFM')) scores['业务增长'] += 20;
          });
        }
      });

      // 4. 更新状态
      setStats(Object.keys(scores).map(key => ({
        subject: key,
        A: Math.min(100, scores[key]) // 最大 100
      })));

    } catch (err: any) {
      console.error('获取用户统计失败:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refreshStats: fetchStats };
}
