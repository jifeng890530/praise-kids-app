import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "夸奖孩子 - AI温暖夸奖生成器",
  description: "用AI生成温暖的夸奖话语，让每个孩子都能感受到鼓励",
  keywords: "夸奖孩子,AI,鼓励,教育,家长",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
