import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { input, intensity } = await request.json()

    if (!input || typeof intensity !== "number") {
      return NextResponse.json({ error: "输入参数无效" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "服务配置错误" }, { status: 500 })
    }

    // 根据强烈程度调整prompt
    const intensityMap = {
      1: "非常温和、轻柔",
      2: "温和、平静",
      3: "友善、温暖",
      4: "积极、正面",
      5: "热情、鼓励",
      6: "充满活力、激励",
      7: "非常热情、振奋",
      8: "激动、兴奋",
      9: "极其热情、狂热",
      10: "超级激动、爆发式",
    }

    const intensityDesc = intensityMap[intensity as keyof typeof intensityMap] || "热情、鼓励"

    const prompt = `你是一个非常善于夸奖和鼓励孩子的专家。请根据以下情况，生成5条${intensityDesc}的夸奖话语来鼓励孩子。

情况描述：${input}

要求：
1. 语气要${intensityDesc}
2. 要真诚、具体，避免空洞的夸奖
3. 要能让孩子感受到被理解和支持
4. 每条回复都要不同的角度和重点
5. 适合中国家长对孩子说的话
6. 每条回复控制在50字以内

请直接返回5条夸奖话语，用换行符分隔，不要添加序号或其他格式。`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://praise-kids.vercel.app",
        "X-Title": "Praise Kids App",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error("No content received from API")
    }

    // 解析回复，分割成5条
    const replies = content
      .split("\n")
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .slice(0, 5)

    return NextResponse.json({ replies })
  } catch (error) {
    console.error("Error generating praise:", error)
    return NextResponse.json({ error: "生成夸奖话语失败，请重试" }, { status: 500 })
  }
}
