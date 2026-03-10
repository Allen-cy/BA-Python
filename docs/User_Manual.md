# 🚀 BA-Python 快速上手指南

> 版本：v1.0.0 | 最后更新：2026-03-10

---

## 面向开发者的快速启动

### 前置要求

- Node.js 18+
- Supabase 账号 ([supabase.com](https://supabase.com))

### 1. 克隆并安装

```bash
git clone <your-repo-url>
cd Project5-study_python
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> 💡 这些信息可在 Supabase Dashboard > Project Settings > API 页面获取。

### 3. 初始化数据库

1. 打开 Supabase Dashboard > SQL Editor
2. 复制 `supabase/migrations/001_initial_schema.sql` 的全部内容
3. 粘贴并点击 "Run"

这将创建 5 张数据表、索引、RLS 策略、触发器和种子数据。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000/

### 5. 部署到 Vercel

```bash
# 方式 1：使用 Vercel CLI
npx vercel

# 方式 2：通过 Vercel Dashboard 导入 GitHub 仓库
```

在 Vercel 中配置与 `.env.local` 相同的环境变量。

## 项目命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (port 3000) |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | TypeScript 类型检查 |
| `npm run clean` | 清理构建产物 |

## 目录结构

```
├── api/                    # Vercel Serverless 后端 API
├── src/
│   ├── components/         # React 视图组件
│   ├── hooks/              # 自定义 React Hooks
│   ├── lib/                # Supabase 客户端等工具
│   └── types/              # TypeScript 类型定义
├── supabase/migrations/    # 数据库迁移脚本
├── docs/                   # 项目文档
├── product_life.md         # 产品生命旅程文档
├── vercel.json             # Vercel 配置
└── .env.example            # 环境变量模板
```
