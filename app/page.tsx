"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Loader2, Heart, Sparkles } from "lucide-react"

interface PraiseResponse {
  replies: string[]
  timestamp: number
}

export default function PraiseKidsApp() {
  const [input, setInput] = useState("")
  const [intensity, setIntensity] = useState([5])
  const [isLoading, setIsLoading] = useState(false)
  const [responses, setResponses] = useState<string[]>([])
  const [history, setHistory] = useState<PraiseResponse[]>([])

  // 正确的方式：使用useEffect加载localStorage数据
  useEffect(() => {
    const saved = localStorage.getItem("praise-history")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load history:", error)
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-praise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input.trim(),
          intensity: intensity[0],
        }),
      })

      if (!response.ok) {
        throw new Error("生成失败")
      }

      const data = await response.json()
      setResponses(data.replies)

      // 保存到localStorage
      const newResponse: PraiseResponse = {
        replies: data.replies,
        timestamp: Date.now(),
      }
      const updatedHistory = [newResponse, ...history].slice(0, 2) // 只保留最近2条
      setHistory(updatedHistory)
      localStorage.setItem("praise-history", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error:", error)
      alert("生成失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-blue-600">夸奖孩子</h1>
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600">用AI生成温暖的夸奖话语，让每个孩子都能感受到鼓励</p>
        </div>

        {/* 主要输入区域 */}
        <Card className="shadow-lg border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
            <CardTitle className="text-center">开始夸奖</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* 输入框 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">孩子说了什么？或者发生了什么事？</label>
              <Textarea
                placeholder="例如：孩子考试只考了10分，很沮丧..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            {/* 语气强烈程度滑块 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">语气强烈程度: {intensity[0]}</label>
              <div className="px-2">
                <Slider value={intensity} onValueChange={setIntensity} max={10} min={1} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>温和</span>
                  <span>热情</span>
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 text-lg font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  正在生成夸奖话语...
                </>
              ) : (
                "开始夸奖 ✨"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 生成结果 */}
        {responses.length > 0 && (
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                温暖的夸奖话语
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {responses.map((reply, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed">{reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <Card className="shadow-lg border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="text-center">最近的夸奖记录</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-gray-500 mb-2">{new Date(item.timestamp).toLocaleString("zh-CN")}</div>
                    <div className="space-y-2">
                      {item.replies.map((reply, replyIndex) => (
                        <p key={replyIndex} className="text-sm text-gray-700 pl-4 border-l-2 border-purple-300">
                          {reply}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
