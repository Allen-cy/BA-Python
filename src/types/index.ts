// 数据库表对应的 TypeScript 类型定义

// 用户角色
export type UserRole = 'student' | 'instructor';

// 课程状态
export type CourseStatus = 'completed' | 'in_progress' | 'locked';

// 进度状态
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

// 用户信息
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

// 课程
export interface Course {
  id: string;
  title: string;
  description: string;
  stage_number: number;
  duration_hours: number;
  icon_type: string;
  tags: string;
  case_count: number;
  created_at: string;
}

// 课节
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  theory_content?: string; // 新增：Python 基础知识/理论内容
  business_background?: string;
  data_dictionary?: { field_name: string; description: string; data_type: string }[];
  hints: string[];
  starter_code: string;
  validation_code: string; // 自动化评测代码
  video_url?: string; // 可选：视频讲解链接
  sort_order: number;
  created_at: string;
}

// 数据字典字段
export interface DataField {
  field_name: string;
  description: string;
  data_type: string;
}

// 用户学习进度
export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string | null;
  status: ProgressStatus;
  progress_percent: number;
  code_snapshot: string | null;
  completed_at: string | null;
  updated_at: string;
}

// 代码提交记录
export interface CodeSubmission {
  id: string;
  user_id: string;
  lesson_id: string;
  code: string;
  output: string | null;
  is_passed: boolean;
  submitted_at: string;
  feedback: string | null;
}

// 课程 + 进度合并视图
export interface CourseWithProgress extends Course {
  status: CourseStatus;
  progress_percent: number;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求
export interface SignUpRequest {
  email: string;
  password: string;
  display_name: string;
}
