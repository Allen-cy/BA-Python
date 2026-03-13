import OpenAI from "openai";

export const config = {
  runtime: 'edge', // Vercel Edge Runtime
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持 POST 请求' }), { status: 405 });
  }

  const { lesson, currentCode, error, userQuestion } = await req.json();

  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '系统未配置 KIMI 密钥' }), { status: 500 });
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.moonshot.cn/v1",
  });

  const prompt = `
你是一位专业的商业分析 (BA) 和 Python 导师。你正在辅导一名学生完成以下课程任务：

【当前课程阶段】：${lesson.course_title || "Python 基础"}
【当前任务】：${lesson.title}
【任务细节】：${lesson.content}

【学生当前代码】：
\`\`\`python
${currentCode}
\`\`\`

【系统检测错误】：
${error || "暂无系统报错"}

【学生提出的具体提问】：
${userQuestion ? `学生问：\"${userQuestion}\"` : "学生没有提出具体问题，请根据代码进度给出指导建议。"}

【辅导要求】：
1. **优先回答学生的具体提问**。
2. 分析学生代码中的问题（如果报错，请指出原因；如果逻辑不符合商业背景，请说明业务逻辑错误）。
3. 提供启发式的引导，**不要直接给出全量答案代码**，而是指导学生如何思考这一步。
4. 语气要亲切、专业。
5. 解答要简练，重点突出核心概念。
6. 必须使用中文回复。

请给出你的辅导反馈：
`;

  try {
    const completion = await client.chat.completions.create({
      model: "kimi-k2.5",
      messages: [
        { role: "system", content: "你是一位专业的商业分析 (BA) 和 Python 导师。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    
    return new Response(JSON.stringify({ feedback: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Kimi API error:', err);
    return new Response(JSON.stringify({ error: 'AI 服务调用失败: ' + err.message }), { status: 500 });
  }
}
