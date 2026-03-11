# ✅ BA-Python 功能清单

> 版本：v1.6.2 | 最后更新：2026-03-11

---

## 已实现功能 (v1.6.2)

### 🔐 认证系统
- [x] 邮箱注册 / 登录
- [x] 会话持久化（自动刷新 token）
- [x] 退出登录
- [x] **演示模式 (Guest Mode)** — 允许绕过登录体验核心功能
- [x] 自动创建用户 profile（PostgreSQL 触发器）
- [x] **登录出错强化拦截** — 显性红色提示框，防止因超时/密码错造成的卡死错觉

### 📊 仪表盘 (UI 2.0)
- [x] **BA 专属商务风视觉** — 橙黑配色，玻璃拟态卡片
- [x] 4 阶段学习路线图动态渲染
- [x] 课程状态追踪（已完成/进行中/未解锁）
- [x] **动态雷达图 (Radar)** — 展示商业/业务/Python等维度技能分布
- [x] 每日学习计划 (Daily Plan) 卡片
- [x] 学习进度条 & 脉冲动画

### 🖥️ 交互式学习工作台
- [x] **“基础+实战”双模态工作台** — 融合理论知识（Theory）与案例练习（Practice）平滑切换
- [x] **Monaco Editor 集成** — 支持 Python 语法高亮、自动缩进、智能提示
- [x] **Pyodide Python 运行时** — WASM 驱动，支持 Pandas/NumPy 浏览器端执行
- [x] **数据预览表格 (Data Table)** — 实时从 Pyodide 文件系统读取并渲染 CSV 数据
- [x] **AI 助教咨询 (Chat Tutor)** — 接入 Gemini 1.5 Flash，提供启发式代码纠错
- [x] **自动化任务评测 (OJ System)** — 基于预置 Python 脚本的业务逻辑自动判定
- [x] **交互动效** — 五彩纸屑庆祝特效、实时终端日志输出、业务词典 Table

### 🗄️ 后端与数据层
- [x] Supabase 全量对接 (Courses/Lessons/Progress/Submissions)
- [x] Vercel Edge Functions (API Gateway)
- [x] Python 模拟资产服务 (crm_raw_data.csv)
- [x] RLS 行级安全策略 (Row Level Security)

---

## 规划中功能

### v2.0.0 — 实战与审计
- [ ] **PDF 学习报告导出** — 生成包含代码镜像和 AI 点评的专业分析报告
- [ ] **多数据集支持** — 接入电商、零售、金融等真实多表 CSV 关联课节
- [ ] **成就系统** — 勋章墙、等级体系升级
- [ ] **项目实战 (Deep Projects)** — 企业级整套数据清洗与可视化大作业

### v2.1.0 — 社区与协同
- [ ] **团队进度排行榜** — 激励协作与竞争
- [ ] **社区问答广场** — 代码 Snippet 分享
- [ ] **GitHub/Google 第三方登录**

### v3.0.0 — 创作者生态
- [ ] **无代码课程编辑器** — 支持 BA 专家低门槛录入课程
- [ ] **移动端深度适配 (PWA)**
