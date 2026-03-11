# 🔑 BA-Python 关键决策记录

> 最后更新：2026-03-11

---

## 对话 #2（2026-03-11 14:00 ~ 16:30）

### 主题：交互式引擎、AI 助教与评测系统 (v1.5.0)

#### 关键决策

| # | 决策 | 原因 | 影响 |
| :--- | :--- | :--- | :--- |
| D-007 | 使用 Pyodide (WASM) | 纯浏览器端运行 Python，无需后端服务器运行代码，响应速度快 | 无需支付昂贵的计算服务器费用 |
| D-008 | 集成 Monaco Editor | 提供 VS Code 级的代码编辑体验，支持语法高亮和自动缩进 | 提升 BA 学生的使用专业感 |
| D-009 | 运行时内评测逻辑 | 利用 Pyodide 的 `locals()` 检查用户代码状态，比简单的字符串匹配更准确 | 支持更复杂的 OJ 级逻辑校验 |
| D-010 | Pandas 数据读取闭环 | 使用 Python 将 CSV 转为 JSON 返回给 React Table | 实现了数据分析与 UI 的实时联动 |
| D-011 | Pyodide 版本对齐 (0.29.3) | 修复 subagent 发现的版本不匹配问题 | 确保 WASM 运行时在本地稳定加载 |

#### 技术问题与解决方案

| 问题 | 解决方案 |
| :--- | :--- |
| `Pyodide version does not match` | 将 `lib/pyodide.ts` 中的 `indexURL` 升级为 `v0.29.3` 与 package.json 保持一致 |
| AI Tutor 返回 `Unexpected end of JSON` | 识到 `vite dev` 不会自动代理 `api/` 目录；建议使用 `vercel dev` 进行联调 |
| 代码提交后 UI 没反馈 | 在 `WorkspaceView` 中增加五彩纸屑 (Confetti) 特效和 Toast 通知 |

#### 开发者须知

- 本地调试 API (Gemini/AI Tutor) 建议使用 `vercel dev`
- `lessons` 表需要增加 `validation_code` 字段方可使用自动评测功能
