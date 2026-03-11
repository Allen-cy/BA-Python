import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CourseWithProgress, Lesson } from '../types';

// 课程数据管理 Hook
export function useCourses() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取课程列表
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 直接从 Supabase 获取课程
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('stage_number', { ascending: true });

      if (coursesError) throw coursesError;

      // 尝试获取用户进度
      const { data: { session } } = await supabase.auth.getSession();
      let progressMap: Record<string, { status: string; progress_percent: number }> = {};

      if (session?.user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('course_id, status, progress_percent')
          .eq('user_id', session.user.id);

        if (progress) {
          progressMap = progress.reduce((acc, p) => {
            acc[p.course_id] = { status: p.status, progress_percent: p.progress_percent };
            return acc;
          }, {} as Record<string, { status: string; progress_percent: number }>);
        }
      }

      // 合并课程与进度
      const merged: CourseWithProgress[] = (coursesData || []).map((course, index) => {
        const userProgress = progressMap[course.id];
        let status: 'completed' | 'in_progress' | 'locked';
        let progressPercent: number;

        if (userProgress) {
          status = userProgress.status as 'completed' | 'in_progress' | 'locked';
          progressPercent = userProgress.progress_percent;
        } else if (index === 0) {
          status = 'completed';
          progressPercent = 100;
        } else if (index === 1) {
          status = 'in_progress';
          progressPercent = 65;
        } else {
          status = 'locked';
          progressPercent = 0;
        }

        return { ...course, status, progress_percent: progressPercent };
      });

      setCourses(merged);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(message);
      // 如果数据库没有数据，使用静态备用数据
      setCourses(getDefaultCourses());
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取课节详情
  const fetchLesson = useCallback(async (courseId: string) => {
    try {
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true })
        .limit(1)
        .single();

      if (lessonError) throw lessonError;

      // 获取课程标题
      const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single();

      const result = { ...lesson, course_title: course?.title || '' };
      setCurrentLesson(result);
      return result;
    } catch {
      // 备用数据
      const lesson = getDefaultLesson();
      setCurrentLesson(lesson);
      return lesson;
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    currentLesson,
    loading,
    error,
    fetchCourses,
    fetchLesson,
  };
}

// 静态备用课程数据（当 Supabase 不可用时使用）
function getDefaultCourses(): CourseWithProgress[] {
  return [
    {
      id: 'default-1',
      title: '基础商业 ROI 计算',
      description: '掌握如何使用 Python 计算各种业务指标及投资回报率。通过 Python 基础语法和算数运算符解决实际商业投入产出分析问题。',
      stage_number: 1,
      duration_hours: 1.5,
      icon_type: 'calculator',
      tags: 'Python 基础',
      case_count: 3,
      created_at: new Date().toISOString(),
      status: 'completed',
      progress_percent: 100,
    },
    {
      id: 'default-2',
      title: '使用 Pandas 进行 CRM 数据清洗',
      description: '商业分析的核心是数据。学习使用 Pandas 处理真实 CRM 系统导出的脏数据：处理缺失值、异常值并整合多维度的客户表格。',
      stage_number: 2,
      duration_hours: 4.0,
      icon_type: 'table',
      tags: 'Pandas 核心库',
      case_count: 5,
      created_at: new Date().toISOString(),
      status: 'in_progress',
      progress_percent: 65,
    },
    {
      id: 'default-3',
      title: 'AARRR 漏斗可视化分析',
      description: '结合海盗模型（AARRR）进行流量转化分析。学习 Matplotlib 和 Seaborn 绘制漏斗图，识别业务转化瓶颈环节。',
      stage_number: 3,
      duration_hours: 3.5,
      icon_type: 'bar-chart',
      tags: '增长黑客模型',
      case_count: 4,
      created_at: new Date().toISOString(),
      status: 'locked',
      progress_percent: 0,
    },
    {
      id: 'default-4',
      title: 'RFM 客户价值模型构建',
      description: '高级客户分层模型。基于 R (近期消费)、F (消费频率)、M (消费金额) 三个维度，使用 Python 实现客户聚类，制定差异化运营策略。',
      stage_number: 4,
      duration_hours: 5.0,
      icon_type: 'users',
      tags: '客户分群实战',
      case_count: 6,
      created_at: new Date().toISOString(),
      status: 'locked',
      progress_percent: 0,
    },
  ];
}

// 静态备用课节数据
function getDefaultLesson(): Lesson {
  return {
    id: 'default-lesson-1',
    course_id: 'default-2',
    title: 'CRM 脏数据清洗',
    content: '在这个实战课节中，你将学习如何使用 Pandas 对 CRM 系统导出的原始数据进行清洗处理。',
    business_background: '公司的 CRM（客户关系管理）系统最近导入了一批原始数据，但由于采集渠道不同，存在大量的重复记录、缺失值以及异常的消费金额。\n\n作为商业分析师，你的任务是使用 Python 的 Pandas 库对这批数据进行"大扫除"，确保后续的 RFM 模型分析能够基于准确的数据进行。',
    data_dictionary: [
      { field_name: 'customer_id', description: '唯一客户 ID', data_type: 'String' },
      { field_name: 'spend', description: '累计消费金额', data_type: 'Float' },
      { field_name: 'last_visit', description: '最后访问日期', data_type: 'DateTime' },
    ],
    hints: [
      '使用 df.dropna() 处理缺失值。',
      '使用 df.drop_duplicates() 移除重复行。',
      '过滤负数金额：df[df[\'spend\'] > 0]。',
    ],
    starter_code: `import pandas as pd\n\n# 1. 加载 CRM 原始数据\ndf_crm = pd.read_csv('crm_raw_data.csv')\n\n# 2. 清洗逻辑开始\n# TODO: 处理 spend 列中的负数\ndf_clean = df_crm[df_crm['spend'] > 0]\n\n# 3. 打印结果摘要\nprint("清洗后的数据行数:", len(df_clean))`,
    sort_order: 1,
    created_at: new Date().toISOString(),
  };
}
