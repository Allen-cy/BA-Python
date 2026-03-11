import OpenAI from "openai";

export const config = {
  runtime: 'edge', // Vercel Edge Runtime
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持 POST 请求' }), { status: 405 });
  }

  const { lesson, currentCode, error } = await req.json();

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

【课程背景】：${lesson.business_background}
【当前任务】：${lesson.title}
【任务细节】：${lesson.content}

【学生当前代码】：
\`\`\`python
${currentCode}
\`\`\`

【学生反馈的错误/问题】：
${error || "暂无报错，但学生需要指导"}

【辅导要求】：
1. 分析学生代码中的问题（如果报错，请指出原因；如果逻辑不符合商业背景，请说明业务逻辑错误）。
2. 提供启发式的引导，**不要直接给出全量答案代码**，而是指导学生如何思考这一步。
3. 语气要亲切、专业。
4. 解答要简练，重点突出 Pandas/ROI 计算等核心概念。
5. 必须使用中文回复。

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
