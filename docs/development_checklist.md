# BA-Python 开发清单

> 版本：v2.1.0 | 最后更新：2026-03-18

---

## Phase 1: 基础设施搭建

- [x] 安装 Supabase 客户端依赖
- [x] 创建 TypeScript 类型定义 (`src/types/index.ts`)
- [x] 编写数据库迁移脚本 (`supabase/migrations/001_initial_schema.sql`)
- [x] 配置 Vercel (`vercel.json`)

## Phase 2: 后端 API 开发

- [x] 服务端工具库 (`api/_lib/supabase.ts`)
- [x] 课程列表 API (`api/courses/index.ts`)
- [x] 进度管理 API (`api/progress/index.ts`)

## Phase 3: UI 2.0 深度融合 (v1.1.0)

- [x] 升级 `package.json` (recharts, canvas-confetti)
- [x] 全量迁移 `Header` & `Sidebar` 组件
- [x] 重构 `App.tsx` 的导航逻辑与认证分流
- [x] 重构 `DashboardView` & `WorkspaceView` (数据驱动)

## Phase 4: 基础设施交付 (v1.2.0)

- [x] 修复数据库迁移脚本的幂等性问题 (Policy exists error)
- [x] 成功配置 SSH 远程仓库 (`git@github.com:Allen-cy/BA-Python.git`)
- [x] 代码全量同步至 GitHub

## Phase 5: 动力系统集成 (v1.5.0)

- [x] **Pyodide Python 运行时** — 支持 Pandas 执行 ✅
- [x] **Monaco Editor** — 语法高亮与专业编辑 ✅
- [x] **Gemini AI 助教** — 启发式纠错接口 ✅
- [x] **自动化评测系统** — 业务逻辑判定 ✅
- [x] **数据预览表格** — CSV 实时预览 ✅
- [x] **初始化数据资产** — CRM 数据集成 ✅

## Phase 6: 文档体系（超级协议）

- [x] `product_life.md` — 产品生命旅程文档 (v1.5.0)
- [x] `docs/product_prd.md` — 产品需求文档
- [x] `docs/Task_Log.md` — 任务看板 (v1.5.0)
- [x] `docs/conversation_history.md` — 完整对话历史
- [x] `docs/Dev_Plan.md` — 迭代路线图

## 下一步工作 (Next Steps)

- [x] 开发 **PersonalCenterView** 的雷达图真实统计逻辑 ✅
- [ ] 开发 **ProjectsView** 项目实战模块
- [x] 实现 **PDF 学习报告导出** 功能 ✅
- [ ] 优化 Pyodide 初次加载速度 (CDN/Caching)

## Phase 7: 内容分享与传播 (v2.1.0)

- [x] **Vibe Coding 全流程 PPT** — HTML 演示文稿生成 ✅
- [ ] 教程 Notion 文档同步至应用内置文档
