# Product_Life.md (产品生命旅程文档)

## 任务历史与演进

### [v1.1.0] - 2026-03-13 - 知识体系重构与 AI 导师增强
- **指令类型：** 重构 / 功能新增
- **逻辑链路：**
  - **核心痛点：** 原有课程体系零散，缺乏系统性；AI 导师仅支持预设代码分析，无法进行深度问答。
  - **解决方案：**
    1. **结构化重构：** 编写 Python 脚本将原始 Markdown 知识库解析为 17 阶段的结构化 JSON (`curriculum.json`)，并生成稳定 ID（如 `python-stage-1`）。
    2. **数据源切换：** 重构 `useCourses.ts`，将课程定义从后端 DB 切换至前端静态 JSON，仅将“进度”保留在 Supabase，实现“离线知识库+云端进度”的混合架构。
    3. **AI 导师进化：** 升级 API 接口及 UI 界面，支持用户自定义提问。优化 Prompt 策略，使其具备“优先处理提问、商业视角辅导、启发式教学”三大特性。
- **执行细节：**
  - 调用 `parse_kg.py` 处理 `/Users/allen/Desktop/Vibe Coding/Python_kG` 路径下的知识。
  - 修改 `api/ai/tutor.ts` 及 `useCourses.ts`。
  - 更新 `WorkspaceView.tsx` 和 `DashboardView.tsx`。
- **阶段总结：** 成功将 17 阶段 Python 课程集成到项目中，AI 导师现已具备实时对话能力，用户学习体验得到质的提升。
- **未来演进：**
  - 考虑增加“错题集”功能，自动归档 AI 导师的辅导记录。
  - 优化阶段解锁逻辑，增加多维度能力评估分数。

---
