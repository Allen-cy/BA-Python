# 📝 实现计划 - 任务 #013：学习报告 PDF 导出功能

## 1. 任务背景

在 v2.0.0 阶段，用户需要一个可以将学习成果（能力画像、提交统计）正式化的导出功能，用于职业证明或成果展示。

## 2. 影响分析

- **组件修改**: `PersonalCenterView.tsx` 将增加导出逻辑和按钮。
- **依赖增加**: 需要 `jspdf` 和 `html2canvas`。
- **性能**: 生成 PDF 涉及 Canvas 操作，在大数据量下可能有短暂卡顿，需增加 Loading 状态。

## 3. 技术方案

### A. 依赖安装

```bash
npm install jspdf html2canvas
```

### B. 导出策略

1. 在 `PersonalCenterView` 中创建一个带有 `id="study-report-content"` 的包裹容器。
2. 实现 `usePDFExport` 自定义 Hook。
3. 点击按钮后：
   - 触发 `html2canvas` 捕获该 ID 区域。
   - 生成高分辨率 (Scale: 2) 的 Canvas。
   - 利用 `jspdf` 根据 A4 比例计算缩放并添加图片。
   - 保存文件。

### C. UI 适配

- 导出时隐藏“退出登录”、“导出按钮”等非教学内容。
- 确保雷达图在捕获时已完全渲染。

## 4. TDD 计划 (红色阶段)

- 编写一个测试案例，验证 `exportToPDF` 函数是否被正确调用。
- 验证导出按钮是否存在。

## 5. 任务路线

1. **[x] 安装依赖**
2. **[ ] 创建 PDF 导出工具类**
3. **[ ] 修改 PersonalCenterView UI**
4. **[ ] 联调与优化样式**
5. **[ ] 文档更新 (product_life.md 等)**

---

**请确认是否开始执行？**
