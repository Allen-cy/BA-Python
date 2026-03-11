# BA-Python 开发清单

> 版本：v1.1.0 | 最后更新：2026-03-10

---

## Phase 1: 基础设施搭建
- [x] 安装 Supabase 客户端依赖
- [x] 创建 TypeScript 类型定义 (`src/types/index.ts`)
- [x] 配置 Supabase 客户端 (`src/lib/supabase.ts`)
- [x] 编写数据库迁移脚本 (`supabase/migrations/001_initial_schema.sql`)
- [x] 配置 Vercel (`vercel.json`)
- [x] 更新环境变量模板 (`.env.example`)

## Phase 2: 后端 API 开发
- [x] 服务端工具库 (`api/_lib/supabase.ts`)
- [x] 课程列表 API (`api/courses/index.ts`)
- [x] 课程详情 API (`api/courses/[id].ts`)
- [x] 课节详情 API (`api/lessons/[id].ts`)
- [x] 进度管理 API (`api/progress/index.ts`)
- [x] 代码提交 API (`api/submissions/index.ts`)

## Phase 3: 前端重构 (v1.0.0)
- [x] 认证 Hook (`src/hooks/useAuth.ts`)
- [x] 课程数据 Hook (`src/hooks/useCourses.ts`)
- [x] 进度管理 Hook (`src/hooks/useProgress.ts`)
- [x] 实现基础 MVP 架构

## Phase 4: UI 2.0 深度融合 (v1.1.0)
- [x] 升级 `package.json` (recharts, canvas-confetti)
- [x] 全量迁移 `Header` & `Sidebar` 组件
- [x] 重构 `App.tsx` 的导航逻辑与认证分流
- [x] 重构 `DashboardView` 对接后端动态课程
- [x] 重构 `WorkspaceView` 对接后端动态课节
- [x] 深度定制 `LoginView` (UI 2.0 风格)
- [x] 实现 `ProjectListView` & `PersonalCenterView` (展示层)

## Phase 5: 质量保证
- [x] 构建验证 (`npm run build` ✅)
- [x] TypeScript 类型检查 (`npm run lint` ✅)
- [x] 浏览器视觉验证 (UI 2.0 风格一致性测试 ✅)
- [x] Git 增量提交

## Phase 6: 文档体系（超级协议）
- [x] `product_life.md` — 产品生命旅程文档
- [x] `docs/product_prd.md` — 产品需求文档
- [x] `docs/Task_Log.md` — 任务看板
- [x] 所有核心文档已增量更新

## 待用户完成
- [ ] 创建 Supabase 项目并获取凭证
- [ ] 在 Supabase SQL Editor 执行迁移脚本
- [ ] 创建 `.env.local` 并填入 Supabase 配置
- [ ] 在 GitHub 创建仓库并推送代码
- [ ] 在 Vercel 导入项目并配置环境变量
