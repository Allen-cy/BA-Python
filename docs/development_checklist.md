# BA-Python 开发清单

> 版本：v1.2.0 | 最后更新：2026-03-11

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
- [x] 深度定制 `LoginView` (UI 2.0 风格)

## Phase 4: 基础设施交付 (v1.2.0)
- [x] 修复数据库迁移脚本的幂等性问题 (Policy exists error)
- [x] 成功配置 SSH 远程仓库 (`git@github.com:Allen-cy/BA-Python.git`)
- [x] 代码全量同步至 [GitHub](https://github.com/Allen-cy/BA-Python)
- [x] 构建验证 (`npm run build` ✅)
- [x] TypeScript 类型检查 (`npm run lint` ✅)

## Phase 5: 文档体系（超级协议）
- [x] `product_life.md` — 产品生命旅程文档
- [x] `docs/product_prd.md` — 产品需求文档
- [x] `docs/Task_Log.md` — 任务看板 (v1.2.0 已完成)

## 下一步工作 (Next Steps)
- [ ] 集成 **Pyodide** 开发真实的浏览器端 Python 运行环境
- [ ] 开发 **PersonalCenterView** 的雷达图真实统计逻辑
- [ ] 集成 **Gemini AI** 提供辅助教学
