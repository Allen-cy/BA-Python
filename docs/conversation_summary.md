# 🔑 BA-Python 关键决策记录

> 最后更新：2026-03-10

---

## 对话 #1（2026-03-10 20:00 ~ 21:10）

### 主题：全栈架构改造 + 文档体系初始化

#### 关键决策

| # | 决策 | 原因 | 影响 |
|---|------|------|------|
| D-001 | 使用 Supabase 作为数据库 | 用户明确要求；PostgreSQL + Auth + RLS 一站式解决方案 | 无需自建后端认证和数据库 |
| D-002 | 使用 Vercel Serverless Functions 作为后端 | 用户明确要求 Vercel 部署；与 Vite + React 天然集成 | 移除了 express/better-sqlite3 依赖 |
| D-003 | 前端直连 Supabase（不通过 API 代理） | 减少延迟；Supabase RLS 提供安全保障；降低复杂度 | Hooks 直接使用 supabase-js 客户端 |
| D-004 | 添加静态备用数据 | 确保在未配置 Supabase 时应用仍可演示 | useCourses.ts 包含 fallback 数据 |
| D-005 | 数据库 RLS 策略设计 | 用户只能读写自己的进度和提交；所有人可读课程 | 安全性保障 |
| D-006 | profiles 表通过触发器自动创建 | 简化注册流程；确保 auth.users 与 profiles 同步 | 用户注册后自动有 profile |

#### 技术问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| `import.meta.env` TypeScript 报错 | 在 supabase.ts 顶部添加 `/// <reference types="vite/client" />` |
| 原项目依赖 express/better-sqlite3 | 清理移除，改用 Supabase + Vercel Serverless |

#### 开发者须知

- Supabase 项目需用户手动创建
- 数据库迁移脚本需在 Supabase SQL Editor 中手动执行
- Vercel 环境变量需手动配置
