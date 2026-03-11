-- ================================================
-- BA-Python 学习平台 - 数据库初始化脚本 (幂等增强版)
-- 在 Supabase SQL Editor 中执行此脚本
-- ================================================

-- 0. 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. 用户扩展表（补充 auth.users 信息）
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 课程表
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  stage_number INT NOT NULL,
  duration_hours NUMERIC(4,1) NOT NULL DEFAULT 0,
  icon_type TEXT NOT NULL DEFAULT 'book',
  tags TEXT NOT NULL DEFAULT '',
  case_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 课节表
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  business_background TEXT NOT NULL DEFAULT '',
  data_dictionary JSONB NOT NULL DEFAULT '[]'::jsonb,
  hints JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_code TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 用户学习进度表
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  code_snapshot TEXT,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- 5. 代码提交记录表
CREATE TABLE IF NOT EXISTS public.code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  output TEXT,
  is_passed BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback TEXT
);

-- ================================================
-- 索引
-- ================================================
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON public.user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_user_id ON public.code_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_lesson_id ON public.code_submissions(lesson_id);

-- ================================================
-- 行级安全策略 (RLS)
-- ================================================

-- profiles 表
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可查看所有 profile" ON public.profiles;
CREATE POLICY "用户可查看所有 profile" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "用户只能更新自己的 profile" ON public.profiles;
CREATE POLICY "用户只能更新自己的 profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "用户可创建自己的 profile" ON public.profiles;
CREATE POLICY "用户可创建自己的 profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- courses 表（所有人可读）
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可查看课程" ON public.courses;
CREATE POLICY "所有人可查看课程" ON public.courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "讲师可管理课程" ON public.courses;
CREATE POLICY "讲师可管理课程" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor')
);

-- lessons 表（所有人可读）
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可查看课节" ON public.lessons;
CREATE POLICY "所有人可查看课节" ON public.lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "讲师可管理课节" ON public.lessons;
CREATE POLICY "讲师可管理课节" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor')
);

-- user_progress 表
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可查看自己的进度" ON public.user_progress;
CREATE POLICY "用户可查看自己的进度" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "用户可更新自己的进度" ON public.user_progress;
CREATE POLICY "用户可更新自己的进度" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "用户可创建自己的进度" ON public.user_progress;
CREATE POLICY "用户可创建自己的进度" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- code_submissions 表
ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可查看自己的提交" ON public.code_submissions;
CREATE POLICY "用户可查看自己的提交" ON public.code_submissions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "用户可创建提交" ON public.code_submissions;
CREATE POLICY "用户可创建提交" ON public.code_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================
-- 触发器：自动创建 profile
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', '学员'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 种子数据：初始课程
-- ================================================
INSERT INTO public.courses (title, description, stage_number, duration_hours, icon_type, tags, case_count) VALUES
  ('基础商业 ROI 计算', '掌握如何使用 Python 计算各种业务指标及投资回报率。通过 Python 基础语法和算数运算符解决实际商业投入产出分析问题。', 1, 1.5, 'calculator', 'Python 基础', 3),
  ('使用 Pandas 进行 CRM 数据清洗', '商业分析的核心是数据。学习使用 Pandas 处理真实 CRM 系统导出的脏数据：处理缺失值、异常值并整合多维度的客户表格。', 2, 4.0, 'table', 'Pandas 核心库', 5),
  ('AARRR 漏斗可视化分析', '结合海盗模型（AARRR）进行流量转化分析。学习 Matplotlib 和 Seaborn 绘制漏斗图，识别业务转化瓶颈环节。', 3, 3.5, 'bar-chart', '增长黑客模型', 4),
  ('RFM 客户价值模型构建', '高级客户分层模型。基于 R (近期消费)、F (消费频率)、M (消费金额) 三个维度，使用 Python 实现客户聚类，制定差异化运营策略。', 4, 5.0, 'users', '客户分群实战', 6)
ON CONFLICT DO NOTHING;

-- 为课程 2（CRM 数据清洗）插入示例课节
INSERT INTO public.lessons (course_id, title, content, business_background, data_dictionary, hints, starter_code, sort_order)
SELECT
  c.id,
  'CRM 脏数据清洗',
  '在这个实战课节中，你将学习如何使用 Pandas 对 CRM 系统导出的原始数据进行清洗处理。',
  '公司的 CRM（客户关系管理）系统最近导入了一批原始数据，但由于采集渠道不同，存在大量的重复记录、缺失值以及异常的消费金额。作为商业分析师，你的任务是使用 Python 的 Pandas 库对这批数据进行"大扫除"，确保后续的 RFM 模型分析能够基于准确的数据进行。',
  '[{"field_name": "customer_id", "description": "唯一客户 ID", "data_type": "String"}, {"field_name": "spend", "description": "累计消费金额", "data_type": "Float"}, {"field_name": "last_visit", "description": "最后访问日期", "data_type": "DateTime"}]'::jsonb,
  '["使用 df.dropna() 处理缺失值。", "使用 df.drop_duplicates() 移除重复行。", "过滤负数金额：df[df[''spend''] > 0]。"]'::jsonb,
  E'import pandas as pd\n\n# 1. 加载 CRM 原始数据\ndf_crm = pd.read_csv(''crm_raw_data.csv'')\n\n# 2. 清洗逻辑开始\n# TODO: 处理 spend 列中的负数\ndf_clean = df_crm[df_crm[''spend''] > 0]\n\n# 3. 打印结果摘要\nprint("清洗后的数据行数:", len(df_clean))',
  1
FROM public.courses c
WHERE c.stage_number = 2
ON CONFLICT DO NOTHING;
