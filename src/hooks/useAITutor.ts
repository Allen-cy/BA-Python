import { useState, useCallback } from 'react';

export function useAITutor() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const askTutor = useCallback(async (lesson: any, currentCode: string, error?: string | null) => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson, currentCode, error }),
      });
      const data = await response.json();
      if (data.feedback) {
        setFeedback(data.feedback);
        return data.feedback;
      } else {
        throw new Error(data.error || 'AI 未返回反馈');
      }
    } catch (err: any) {
      setFeedback('抱歉，AI 老师暂时掉线了：' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { askTutor, loading, feedback, setFeedback };
}
