# 任务 #012：切换 AI 引擎至 Kimi (Moonshot AI)

## 📌 任务元数据

- **指令类型**: 优化 / 平台切换 (Refactoring)
- **触发来源**: 用户要求将 API 从 Gemini 切换为 Kimi
- **关联版本**: v1.6.4

## 🎯 目标

1. 确保项目中所有的 AI 接口调用均使用 Moonshot (Kimi) 服务。
2. 移除旧版本的 Gemini 依赖包 (`@google/genai`, `@google/generative-ai`)。
3. 清理前端 UI 中的硬编码 "Gemini 1.5 Pro" 文案，替换为 "Kimi (Moonshot AI)"。
4. 全面更新文档体系，包括 `product_life.md` 等，反映本次引擎变更。

## 🛠️ 执行步骤

- [x] 1. 代码及依赖清理：从 `package.json` 卸载 Google AI SDK。
- [x] 2. UI 更新：修改 `src/views/WorkspaceView.tsx` 底部状态栏。
- [x] 3. 验证功能：运行 `npm run lint` 与 `npm run build` 确保无残余代码。
- [x] 4. 文档联动：按超级协议规范更新所有相关 Markdown 文件。
- [x] 5. 同步上云：执行 Git 提交流程并 push。
