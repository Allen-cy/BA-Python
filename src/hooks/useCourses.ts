import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CourseWithProgress, Lesson } from '../types';
import curriculumData from '../data/curriculum.json';

// 定义本地课程数据的接口
interface RawSection {
  id: string;
  title: string;
  content: string;
  example_code: string;
}

interface RawStage {
  id: string;
  stage_number: number;
  title: string;
  intro: string;
  sections: RawSection[];
}

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
      // 1. 从本地 JSON 获取课程结构 (Stage -> Course)
      const data = curriculumData as { stages: RawStage[] };
      const localCourses: CourseWithProgress[] = data.stages.map((stage) => ({
        id: stage.id,
        title: stage.title,
        description: stage.intro.substring(0, 150).replace(/[#*`\n]/g, '') + '...',
        stage_number: stage.stage_number,
        duration_hours: 1.0, // 默认值
        icon_type: stage.stage_number <= 5 ? 'book' : 'code', // 简单映射
        tags: 'Python 基础',
        case_count: stage.sections.length,
        created_at: new Date().toISOString(),
        status: 'locked', // 初始状态
        progress_percent: 0
      }));

      // 2. 尝试从 Supabase 获取用户进度
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

      // 3. 合并课程与进度
      const merged = localCourses.map((course, index) => {
        const userProgress = progressMap[course.id];
        let status: 'completed' | 'in_progress' | 'locked';
        let progressPercent: number;

        if (userProgress) {
          status = userProgress.status as 'completed' | 'in_progress' | 'locked';
          progressPercent = userProgress.progress_percent;
        } else if (index === 0) {
          // 默认解锁第一个课程
          status = 'in_progress';
          progressPercent = 0;
        } else {
          status = 'locked';
          progressPercent = 0;
        }

        return { ...course, status, progress_percent: progressPercent };
      });

      setCourses(merged);
    } catch (err: unknown) {
      console.error('Fetch courses error:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(message);
      setCourses(getDefaultCourses());
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取课节详情
  const fetchLesson = useCallback(async (courseId: string) => {
    try {
      // 从本地 JSON 查找匹配的 Stage 和 Section
      const data = curriculumData as { stages: RawStage[] };
      const stage = data.stages.find(s => s.id === courseId);
      
      if (!stage || stage.sections.length === 0) {
        throw new Error('Course not found');
      }

      // 映射第一个 Section 为当前 Lesson (可以根据进度优化为获取最后一个未完成的)
      const section = stage.sections[0];
      
      const lesson: Lesson = {
        id: section.id,
        course_id: stage.id,
        title: section.title,
        content: section.content,
        theory_content: section.content, // 直接作为理论内容显示
        business_background: "本章节将通过配套实战练习，帮助你掌握 Python 在商业分析中的应用。",
        hints: ["请仔细阅读理论部分", "注意代码缩进"],
        starter_code: section.example_code || "# 在这里开始编写你的代码\n",
        validation_code: "True", // 默认为 true，后续可根据内容定制
        sort_order: 1,
        created_at: new Date().toISOString()
      };

      setCurrentLesson(lesson);
      return lesson;
    } catch (err) {
      console.error('Fetch lesson error:', err);
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
    content: '1. 处理 <b>spend</b> 列中的负数值（异常数据）。<br/>2. 删除所有 <b>customer_id</b> 为空的行（缺失值）。<br/>3. 计算清洗后 <b>spend</b> 的总额并赋值给 <code>total_revenue</code>。',
    theory_content: `### 🧺 Pandas 基础清洗三板斧

作为商业分析师，你 80% 的时间都在处理“脏数据”。在 Python 中，Pandas 提供了类似 Excel “删除重复项”和“筛选”的高级功能。

#### 1. 处理缺失值 (NaN)
缺失数据在 Pandas 中以 \`NaN\` (Not a Number) 表示。
\`\`\`python
# 删除包含任何空值的行
df.dropna(subset=['列名'])
\`\`\`

#### 2. 数据布尔索引 (筛选)
这是最强大的功能。你可以像写 SQL 里的 WHERE 一样过滤数据。
\`\`\`python
# 只保留金额大于 0 的有效订单
df_clean = df[df['amount'] > 0]
\`\`\`

#### 3. 数学聚合
\`\`\`python
# 计算某一列的总和
total = df['amount'].sum()
\`\`\`

> **小贴士**：在 BA 实战中，金额为负通常是退款或者系统录入错误，记得要先沟通业务逻辑再决定是删除还是取绝对值。`,
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
    starter_code: `import pandas as pd\n\n# 1. 加载 CRM 原始数据\ndf_crm = pd.read_csv('crm_raw_data.csv')\n\n# 2. 清洗逻辑开始\n# TODO: 处理 spend 列中的负数并删除 customer_id 为空的行\ndf_clean = df_crm.dropna(subset=['customer_id'])\ndf_clean = df_clean[df_clean['spend'] > 0]\n\n# 3. 计算结果\ntotal_revenue = df_clean['spend'].sum()\n\n# 4. 打印结果摘要\nprint(f"清洗后的有效数据行数: {len(df_clean)}")\nprint(f"当前总业绩: {total_revenue}")`,
    validation_code: "total_revenue > 0 and 'df_clean' in locals()",
    video_url: 'https://example.com/video',
    sort_order: 1,
    created_at: new Date().toISOString(),
  };
}
