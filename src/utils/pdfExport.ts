import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * 将指定 DOM 元素导出为 PDF
 * @param elementId 目标元素 ID
 * @param fileName 文件名
 */
export async function exportElementToPDF(elementId: string, fileName: string = 'BA-Python-Report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // 1. 捕获 Canvas
  const canvas = await html2canvas(element, {
    scale: 2, // 提高分辨率
    useCORS: true,
    logging: false,
    backgroundColor: '#f8fafc', // 匹配背景色
    onclone: (clonedDoc) => {
      const pdfOnlyElements = clonedDoc.querySelectorAll('.pdf-only');
      pdfOnlyElements.forEach((el) => {
        (el as HTMLElement).style.display = 'flex';
      });
    }
  });

  const imgData = canvas.toDataURL('image/png');
  
  // 2. 初始化 PDF (A4 纸张)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // 3. 添加图片
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  // 4. 保存
  pdf.save(fileName);
}
