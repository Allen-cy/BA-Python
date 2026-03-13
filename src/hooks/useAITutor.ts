import { useState, useCallback } from 'react';

export function useAITutor() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const askTutor = useCallback(async (lesson: any, currentCode: string, userQuestion?: string, error?: string | null) => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson, currentCode, userQuestion, error }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('AI Tutor API Error:', text);
        if (response.status === 404) {
          throw new Error('API 端点未找到 (404)。请确保使用 `vercel dev` 而不是 `npm run dev` 运行，以启动后端 API。');
        }
        throw new Error(`API 请求失败 (${response.status}): ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      if (data.feedback) {
        setFeedback(data.feedback);
        return data.feedback;
      } else {
        throw new Error(data.error || 'AI 未返回反馈');
      }
    } catch (err: any) {
      console.error('AI Tutor Catch:', err);
      const errorMessage = err.message.includes('Unexpected end of JSON input') 
        ? 'API 响应格式错误。如果是本地测试，请务必使用 `vercel dev` 命令。'
        : err.message;
      setFeedback('抱歉，AI 老师暂时掉线了：' + errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { askTutor, loading, feedback, setFeedback };
}
