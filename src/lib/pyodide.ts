import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let loadingPromise: Promise<PyodideInterface> | null = null;

export async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
      stdout: (text) => console.log('Python stdout:', text),
      stderr: (text) => console.error('Python stderr:', text),
    });

    // 加载核心商业分析库
    console.log('Loading Python packages: pandas, numpy...');
    await pyodide.loadPackage(['pandas', 'numpy']);
    
    // 初始化数据环境
    await pyodide.runPythonAsync(`
import pandas as pd
import numpy as np

# 创建示例 CRM 数据以便直接使用
data = {
    'customer_id': ['C001', 'C002', 'C003', 'C004', 'C005'],
    'spend': [1200.5, -50.0, 3400.0, 1200.5, 890.2],
    'last_visit': ['2024-01-10', '2024-02-15', '2024-01-20', '2024-01-10', '2024-03-01']
}
pd.DataFrame(data).to_csv('crm_raw_data.csv', index=False)
print("Environment ready: crm_raw_data.csv created.")
    `);

    pyodideInstance = pyodide;
    return pyodide;
  })();

  return loadingPromise;
}
