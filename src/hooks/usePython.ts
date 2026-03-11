import { useState, useCallback, useEffect } from 'react';
import { getPyodide } from '../lib/pyodide';

export function usePython() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 初始化时静默启动加载
  useEffect(() => {
    getPyodide();
  }, []);

  const runCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    const logs: string[] = [];

    try {
      const pyodide = await getPyodide();
      
      // 重定向输出以捕获本次运行的日志
      pyodide.setStdout({
        batched: (text) => {
          logs.push(text);
          setOutput([...logs]);
        }
      });

      await pyodide.runPythonAsync(code);
      return { success: true, logs };
    } catch (err: any) {
      const errMsg = err.message || '运行 Python 代码时出错';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const validateCode = useCallback(async (code: string, validationCode?: string) => {
    setLoading(true);
    setError(null);
    const logs: string[] = [];

    try {
      const pyodide = await getPyodide();
      
      // 捕获输出
      pyodide.setStdout({
        batched: (text) => {
          logs.push(text);
          setOutput([...logs]);
        }
      });

      // 1. 运行用户代码
      await pyodide.runPythonAsync(code);

      // 2. 如果没有验证脚本，默认通过
      if (!validationCode) {
        return { success: true, isPassed: true, logs };
      }

      // 3. 运行验证脚本并获取布尔返回值
      // 验证脚本通常是： 'condition1' and 'condition2'
      const isPassed = await pyodide.runPythonAsync(validationCode);
      
      return { success: true, isPassed: !!isPassed, logs };
    } catch (err: any) {
      const errMsg = err.message || '评测代码时出错';
      setError(errMsg);
      return { success: false, isPassed: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileData = useCallback(async (filename: string) => {
    try {
      const pyodide = await getPyodide();
      // 获取文件内容并转换为 JSON
      const result = await pyodide.runPythonAsync(`
import pandas as pd
import json
try:
    df = pd.read_csv('${filename}')
    json.dumps(df.head(50).to_dict(orient='records'))
except Exception as e:
    json.dumps({"error": str(e)})
      `);
      return JSON.parse(result);
    } catch (err) {
      console.error('读取文件失败:', err);
      return null;
    }
  }, []);

  return { runCode, validateCode, getFileData, loading, output, error, setOutput };
}
