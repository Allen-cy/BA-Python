# 🧬 BA-Python 产品生命旅程文档

> 本文档记录产品从诞生到每一次迭代的完整生命历程。每次任务执行均在此登记，严禁压缩上下文。

---

## 📌 当前版本：v1.5.0 (2026-03-11)

---

## 时间轴记录（按时间正序）

---

### 📝 任务 #001 — 全栈架构改造

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 新增 (Major Feature) |
| **时间戳** | 2026-03-10 20:00 ~ 21:10 (CST) |
| **关联版本** | v1.0.0 |
| **触发来源** | 用户请求：分析前端代码，生成后端代码，实现前后端一体 Web 应用 |

#### 🧠 逻辑链路（AI 思维链）

1. **初始分析**：审查了项目的完整前端代码。发现这是一个使用 Vite + React 19 + TailwindCSS 4 + Lucide Icons 构建的纯静态 Python 商业分析学习平台（BA-Python），包含两个视图：
   - `DashboardView`：仪表盘 + 4 阶段学习路线图
   - `WorkspaceView`：三面板学习工作台（教程 + 编辑器 + 控制台）
   - 无任何数据交互，全部为硬编码静态数据

2. **架构决策**：
   - **为什么选 Supabase？** 用户明确要求使用 Supabase；其 PostgreSQL + Auth + RLS + 实时特性非常契合学习平台场景
   - **为什么选 Vercel Serverless？** 用户明确要求使用 Vercel 部署；Vite + React 应用天然适配 Vercel，Serverless Functions 提供轻量后端
   - **为什么不用 Express？** 原 `package.json` 中有 express 和 better-sqlite3 依赖，但在 Vercel 部署模式下不需要传统 Node.js 服务器，已清理

3. **数据模型设计**：
   - 分析前端 UI 中的数据需求，反推出 5 张数据表：`profiles`、`courses`、`lessons`、`user_progress`、`code_submissions`
   - 设计了 `(user_id, course_id)` 唯一约束以支持进度 upsert
   - 配置完整的 RLS 策略确保数据安全
   - 创建 `handle_new_user()` 触发器自动初始化用户 profile

4. **备用数据策略**：
   - 在 `useCourses.ts` Hook 中实现了 fallback 机制：当 Supabase 不可用时自动使用静态备用数据
   - 确保应用在未配置数据库时依然可正常运行演示

#### 🛠️ 执行细节（任务 #001）

| 工具/技能 | 用途 |
| :--- | :--- |
| `write_to_file` | 创建 17 个新文件 |
| `view_file` | 分析现有前端代码 |
| `run_command` (npm install) | 安装 `@supabase/supabase-js` 等依赖 |
| `run_command` (npm run build) | 构建验证 |
| `run_command` (npm run lint) | TypeScript 类型检查 |
| `browser_subagent` | 浏览器实际渲染验证 |
| `run_command` (git init/add/commit) | 版本控制 |

**遇到的技术阻碍：**

- TypeScript 类型检查报错 `import.meta.env` 未定义 → 解决方案：在 `supabase.ts` 顶部添加 `/// <reference types="vite/client" />`

**最终结果：**

- `npm run build` ✅ 构建通过
- `npm run lint` ✅ TypeScript 零错误
- 浏览器渲染 ✅ 登录页 + 仪表盘均正常

#### 🔮 未来演进（任务 #001）

1. **短期计划**：
   - 用户配置 Supabase 项目后验证端到端数据流
   - 实现真实的 Python 代码运行（集成 Pyodide 或后端沙箱）
   - 添加更多课节内容和学习资料

2. **中期计划**：
   - 集成 Gemini AI 提供智能代码反馈
   - 添加「社区问答」模块
   - 实现课程完成证书生成

3. **长期规划**：
   - 多用户协作编辑
   - 课程创作者后台
   - 用户学习数据分析仪表盘

#### 📊 阶段总结（任务 #001）

本构任务将一个纯静态前端 React 应用成功改造为 **前后端一体的全栈 Web 应用**。共创建 17 个新文件，涵盖：

- 6 个 Vercel Serverless API 端点
- 3 个 React 自定义 Hooks
- 3 个拆分视图组件
- 1 份数据库迁移脚本（含 5 张表 + RLS + 触发器 + 种子数据）
- 完整的部署配置和文档

所有构建和类型检查均通过，浏览器验证正常。待用户配置 Supabase 凭证后即可投入使用。

---

### 📝 任务 #002 — 超级协议文档体系初始化

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 文档补全 (Documentation) |
| **时间戳** | 2026-03-10 21:10 (CST) |
| **关联版本** | v1.0.0 |
| **触发来源** | 用户请求：基于超级协议补齐产品生命旅程文档和自动化文档体系 |

#### 🧠 逻辑链路

1. 审查超级协议 GEMINI.md 中关于【产品全生命周期演进协议 v1.0】的要求
2. 盘点项目现有文档：仅 `README.md` 和 `docs/development_checklist.md`，缺 10 份核心文档
3. 逐一创建所有必需文档，确保格式和内容符合协议要求

#### 🛠️ 执行细节（任务 #002）

创建以下文档：

- `product_life.md` — 产品生命旅程（本文档）
- `docs/product_prd.md` — 产品需求文档
- `docs/product_manual.md` — 用户手册
- `docs/User_Manual.md` — 快速上手指南
- `docs/RRD.md` — 需求文档
- `docs/Feature_List.md` — 功能清单
- `docs/Dev_Plan.md` — 开发与迭代计划
- `docs/Task_Log.md` — 任务看板
- `docs/conversation_summary.md` — 关键决策记录
- `docs/conversation_history.md` — 完整对话历史

#### 📊 阶段总结（任务 #002）

完成超级协议全部文档体系的初始化，共新增 10 份文档。后续每次迭代将自动增量更新。

---

### 📝 任务 #003 — UI 2.0 深度融合与全栈对接

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 优化 (Major Update) |
| **时间戳** | 2026-03-10 21:30 ~ 22:30 (CST) |
| **关联版本** | v1.1.0 |
| **触发来源** | 用户请求：将 v2-python 中的新 UI 整合进现有全栈应用，实现更专业、更具商业感的界面 |

#### 🧠 逻辑链路（任务 #003）

1. **多维度对比**：对比 `v1.0.0` 与 `v2-python`。发现 `v2-python` 采用了更稳重的橙黑配色方案，引入了全新的组件设计（玻璃拟态、Hexagon 图标）以及新的视图（项目列表、个人中心）。
2. **深度迁移方案**：
   - **基础层**：更新 `package.json` 引入 `recharts` 和 `canvas-confetti`，提升数据可视化和动效体验。
   - **组件层**：全量迁移 `Header` 和 `Sidebar`，使其具备更高审美。
   - **视图层**：将 `DashboardView` 和 `WorkspaceView` 从静态 Vue 改写为数据驱动的 React 版本，并对接 `useCourses` 和 `useProgress`。
   - **路由控制**：重构 `App.tsx` 的状态路由，支持 `dashboard`、`projects`、`profile`、`workspace` 的无缝切换。
3. **认证层重构**：重新设计了 `LoginView`，使其视觉风格与 `v2` 保持高度统一，支持登录、注册和「游客演示」模式。
4. **数据流打通**：
   - `useCourses`：扩展 `fetchLesson` 方法，支持获取课程标题。
   - `DashboardView`：实现从 Supabase 动态渲染课程关卡，支持进度状态显示。
   - `WorkspaceView`：动态加载真实的业务场景和提示信息。

#### 🛠️ 执行细节（任务 #003）

| 工具/技能 | 用途 |
| :--- | :--- |
| `write_to_file` | 更新 `App.tsx` 正本，创建 `LoginView.tsx` |
| `replace_file_content` | 修改 `useCourses.ts` 以支持关联查询 |
| `run_command` (git remote) | 配置 SSH 远端地址：`git@github.com:Allen-cy/BA-Python.git` |
| `git add/commit` | 提交变更：`feat: upgrade to UI 2.0 and integrate full-stack logic` |

**遇到的技术阻碍：**

- `v2-python` 采用的是硬编码导航，而 `v1.0.0` 是全栈驱动。
- 解决方案：将 `currentView` 设为状态变量，并将其控制权在 `Sidebar`、`Header` 和 `Workspace` 之间共享。
- **Git Push 失败**：检测到 SSH 权限错误 (`Permission denied (publickey)`)。
- 解决方案：已在本地提交所有变更，需由开发者在本地终端执行最终推送。

**最终结果：**

- UI 风格升级成功，呈现高级商务感。
- 用户数据、进度、课节详情全链路打通。
- **所有变更已存储在本地 Git 仓库，等待手动同步。**

#### 🔮 未来演进（任务 #003）

1. **短期计划**：
   - 在 `PersonalCenterView` 中展示真实的雷达图（基于提交数据的分析）。
   - 在 `WorkspaceView` 中集成真实的 Python 解释器。

2. **中期计划**：
   - 实现「项目实战」的分领域刷题。

#### 📊 阶段总结（任务 #003）

成功完成了 Phase 2 的 UI 深度整合任务。应用现在拥有更专业的界面和完整的功能逻辑，版本号升级至 `v1.1.0`。

---

### 📝 任务 #005 — 动力系统：集成运行时与 AI 助教

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 新增 (Epic Feature) |
| **时间戳** | 2026-03-11 14:10 ~ 15:00 (CST) |
| **关联版本** | v1.3.0 |
| **触发来源** | 用户需求：同时实现 Pyodide、雷达图逻辑和 Gemini AI 助教 |

#### 🧠 逻辑链路（任务 #005）

1. **并行开发设计**：
   - **执行引擎 (Pyodide)**：在浏览器端构建一个全功能的 Python 环境。使用单例模式管理 Pyodide，确保 pandas/numpy 预加载。
   - **智能反馈 (Gemini)**：利用 Edge Function 桥接 Gemini 1.5 Flash API，实现实时提示。
   - **数据画像 (Radar)**：打通 `PersonalCenterView` 与 `user_progress`，实现基于技能维度的雷达图展示。

#### 📊 阶段总结（任务 #005）

完成 Pyodide 运行时集成及 AI 助教 API。

---

### 📝 任务 #006 — IDE 增强与数据可视化

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 优化 (Major Feature) |
| **时间戳** | 2026-03-11 15:00 ~ 15:30 (CST) |
| **关联版本** | v1.4.0 |
| **触发来源** | 用户需求：集成 Monaco 编辑器和数据预览表格 |

#### 🧠 逻辑链路（任务 #006）

1. **IDE 升级**：引入 `@monaco-editor/react`，实现类似 VS Code 的代码补全、折叠和主题功能。
2. **预览引擎**：利用 `pyodide.runPythonAsync` 通过 Pandas 读取内置 `crm_raw_data.csv`，转为 JSON 后由 React 渲染为实时 Table。

#### 📊 阶段总结（任务 #006）

成功实现 IDE 与数据预览的深度结合，显著提升交互式学习体验。

---

### 📝 任务 #007 — 自动化任务评测系统

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 新增 (Key Feature) |
| **时间戳** | 2026-03-11 15:30 ~ 16:30 (CST) |
| **关联版本** | v1.5.0 |
| **触发来源** | 用户需求：实现代码自动评测逻辑 |

#### 🧠 逻辑链路（任务 #007）

1. **评测逻辑设计**：在 `usePython` 中增加 `validateCode` 方法。
2. **数据契约**：在 `Lesson` 模型中增加 `validation_code`。
3. **闭环验证**：用户点击提交 -> 运行代码 -> WASM 内部运行评测脚本 -> 返回布尔值 -> UI 触发五彩纸屑或错误提示。

#### 📊 阶段总结（任务 #007）

实现 OJ 级的自动评测系统，核心教学环节达成闭环。

---

### 📝 任务 #008 — AI 助教本地环境热修复

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 修复 (Hotfix) |
| **时间戳** | 2026-03-11 16:30 ~ 16:45 (CST) |
| **关联版本** | v1.5.1 |
| **触发来源** | 用户反馈：AI 老师掉线，提示 `Unexpected end of JSON input` |

#### 🧠 逻辑链路 (Task #008)

1. **根因分析**：由于 `vite dev` 仅作为前端开发服务器，并不具备托管 `api/` 目录下 Serverless Functions 的能力，导致前端向 `/api/ai/tutor` 发起请求时返回了 Vite 的 404 HTML 页面而非 JSON。
2. **健壮性优化**：修改 `useAITutor.ts`，增加对 `response.ok` 的校验。若返回 404，明确提示用户使用 `vercel dev` 环境。
3. **工程化改进**：在 `package.json` 中新增 `vercel:dev` 脚本，引导用户使用正确的一体化开发环境。

#### 📊 阶段总结（任务 #008）

解决了本地开发环境下 API 路由无法解析导致的 AI 功能失效问题。

---

### 📝 任务 #009 — 转型“知识+案例”一体化教学平台

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 架构升级 (Architecture Pivot) |
| **时间戳** | 2026-03-11 15:40 |

#### 🧠 逻辑链路 (Task #009)

1. **需求洞察**：用户反馈平台目前只有“案例练习”，缺乏“基础知识学习”，无法形成闭环。
2. **Schema 扩展**：升级 `Lesson` 类型定义，新增 `theory_content` 字段，支持 Markdown/HTML 格式的理论讲解。
3. **UI 深度重构**：将工作台左侧面板改造为“双模态”布局（基础知识 Theory vs 案例练习 Practice），支持平滑切换与动画效果。
4. **内容预设**：重写 `useCourses.ts` 中的示例数据，提供高质量的“Pandas 洗数三板斧”理论精讲及配套实战任务。

#### 📊 阶段总结（任务 #009）

成功完成从“在线评测模式”向“一体化教学模式”的战略转型，显著提升了 BA-Python 的教育深度。

---

### 📝 任务 #010 — 修复 Vercel Dev 环境下源码解析冲突

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | Bug 修复 (Hotfix) |
| **时间戳** | 2026-03-11 15:55 |

#### 🧠 逻辑链路 (Task #010)

1. **现象诊断**：`vercel dev` 运行时，页面报 `Internal Server Error`，浏览器无法解析 `index.html` 作为 JS。
2. **深度排查**：发现 `vercel.json` 的 SPA 重写规则过于激进，将 Vite 内部使用的路径（如 `/@vite/client`）也重写到了 `index.html`。
3. **精准修复**：优化 `rewrites` 正则表达式 `(?!api/|@|.*\\.)`，排除以 `@` 开头的 Vite 内部请求，确保源码正常交付。

#### 📊 阶段总结（任务 #010）

解决了本地开发服务器对源码文件的“内容劫持”问题，恢复了 `vercel dev` 的正常调试能力。

---

### 📝 任务 #011 — 修复本地调试环境阻塞与登录体验优化

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 优化与修复 (UX Improvement & Fix) |
| **时间戳** | 2026-03-11 17:35 |

#### 🧠 逻辑链路 (Task #011)

1. **环境调试**：清理底层卡死的 `node` 进程，确保 `vercel dev` 能稳定在 `http://localhost:3000` 启动，解决由于 3000 端口占用自动顺延到 3001 导致的前端错乱。
2. **体验优化**：修复登录页在请求失败或密码错误时没有任何反馈的问题，改写 `LoginView.tsx` 中的 `handleSubmit` 并加入 try-catch 与 errorMsg 红色错误提示框。
3. **闭环验证**：通过 Puppeteer 无头浏览器实现本地 `http://localhost:3000` 截图，证明首屏与登录逻辑恢复正常。

#### 📊 阶段总结（任务 #011）

打通了本地环境的最后调试阻碍，并增强了登录的错误反馈容错度，让产品进入高度可用的稳定状态。

---

### 📝 任务 #012 — 智能引擎内核切换：Kimi (Moonshot AI) 全面替代

| 元数据 | 值 |
| :--- | :--- |
| **指令类型** | 引擎迁移 (Engine Migration) |
| **时间戳** | 2026-03-11 18:35 (CST) |
| **关联版本** | v1.6.4 |
| **触发来源** | 用户指令：集成正式 Kimi API Key 并清理 Gemini 残余依赖 |

#### 🧠 逻辑链路 (Task #012)

1. **底层适配**：验证 `api/ai/tutor.ts` 已使用 `OpenAI` SDK 兼容 Moonshot 协议，并配置 `https://api.moonshot.cn/v1` 基址。
2. **依赖瘦身**：识别并移除 `package.json` 中的 `@google/genai` 系列冗余包，减少 Node 模块体积并消除潜在代码混淆。
3. **视觉一致性**：修正工作台底部的渲染逻辑，将硬编码的 "Gemini" 字样更新为更优雅的 "LLM: Kimi (Moonshot)"。
4. **协议闭环**：同步更新 `task.md` 与多份核心文档，确保 AI 与开发者的认知完全对齐。

#### 📊 阶段总结（任务 #012）

成功将产品的大脑从 Gemini 切换至 Kimi，实现了更符合中文语境的代码辅助体验，同时完成了代码库的依赖清理。

---

## 🔝 顶部记录：版本演进摘要

- **v1.6.4**: 完成 AI 引擎向 Kimi (Moonshot) 的平滑迁移，清理冗余依赖包，更新 UI 标识。
- **v1.6.3**: 基础架构调研与 Kimi 接口初步对接。
- **v1.6.2**: 修复登录页无错误提示导致的“卡死”错觉体验，增加红色报错UI反馈，彻底清理僵尸进程以保证 3000 端口可用。
- **v1.6.0**: 转型一体化教学，上线“基础+实战”双模态工作台。
- **v1.5.1**: 修复本地 API 路由与 404 捕获。
- **v1.5.0**: 集成自动化评测系统，OJ 级教学闭环达成。
- **v1.4.0**: 集成 Monaco Editor & Data Table Preview。
- **v1.3.0**: 集成 Pyodide 运行时 & Gemini AI 助教。
- **v1.2.0**: 修复基础架构 SQL & Git 权限。
- **v1.1.0**: 深度融合 V2 视觉风格。
- **v1.0.0**: 初始全栈架构搭建。
