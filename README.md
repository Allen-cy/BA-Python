<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BA-Python 商业分析实战学习平台

> 基于真实业务场景，从零构建 Python 商业分析能力的全栈 Web 应用。

## 技术架构

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Tailwind CSS 4 |
| 后端 | Vercel Serverless Functions (Node.js) |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Supabase Auth |
| 部署 | Vercel |

## 本地开发

### 前置要求
- Node.js 18+
- [Supabase](https://supabase.com) 项目

### 步骤

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量，复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```
   
   然后填入你的 Supabase 配置：
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. 初始化数据库，在 [Supabase SQL Editor](https://supabase.com/dashboard) 中执行：
   ```
   supabase/migrations/001_initial_schema.sql
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

## Vercel 部署

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量（与 `.env.local` 相同）
4. 点击部署

## 项目结构

```
├── api/                    # Vercel Serverless Functions
│   ├── _lib/supabase.ts    # 服务端 Supabase 客户端
│   ├── courses/            # 课程 API
│   ├── lessons/            # 课节 API
│   ├── progress/           # 进度 API
│   └── submissions/        # 代码提交 API
├── src/
│   ├── components/         # React 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   └── types/              # TypeScript 类型
├── supabase/
│   └── migrations/         # 数据库迁移脚本
└── vercel.json             # Vercel 配置
```

## 功能特性

- ✅ 用户注册/登录（Supabase Auth）
- ✅ 4 阶段学习路线图
- ✅ 交互式 Python 代码编辑器
- ✅ 学习进度追踪
- ✅ 代码提交与评审
- ✅ 演示模式（无需登录）
