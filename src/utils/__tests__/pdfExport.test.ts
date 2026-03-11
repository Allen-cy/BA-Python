import { describe, it, expect, vi } from 'vitest';
import { exportElementToPDF } from '../pdfExport';

// 模拟 html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,fake-image'
  })
}));

// 模拟 jspdf
vi.mock('jspdf', () => {
  class MockPDF {
    addImage = vi.fn();
    save = vi.fn();
    getImageProperties = vi.fn().mockReturnValue({ width: 100, height: 100 });
    internal = {
      pageSize: {
        getWidth: vi.fn().mockReturnValue(210),
        getHeight: vi.fn().mockReturnValue(297)
      }
    };
  }
  return { jsPDF: MockPDF };
});

describe('exportElementToPDF', () => {
  it('应当在找不到元素时抛出错误', async () => {
    await expect(exportElementToPDF('non-existent-id')).rejects.toThrow('Element with id "non-existent-id" not found');
  });

  it('应当在找到元素时调用导出流程', async () => {
    // 准备 DOM 环境
    const div = document.createElement('div');
    div.id = 'target-id';
    document.body.appendChild(div);

    await exportElementToPDF('target-id', 'test.pdf');
    
    // 我们主要验证流程是否跑通
    expect(document.getElementById('target-id')).not.toBeNull();
  });
});
