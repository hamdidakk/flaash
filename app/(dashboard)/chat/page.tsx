"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { ChatSettingsPanel } from "@/components/chat/chat-settings-panel"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"

export default function ChatPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I can help you find information in your documents. What would you like to know?",
      citations: [],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), role: "user", content: input, citations: [] }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Based on your documents, here is the information you requested. The product specifications indicate that the system supports real-time processing with scalable architecture.",
        citations: [
          { id: 1, document: "Product Specifications.pdf", page: 5, content: "Real-time processing capabilities..." },
          { id: 2, document: "Technical Documentation.pdf", page: 12, content: "Scalable architecture design..." },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title={t("chat.title")} description={t("chat.description")} />
        <ChatSettingsPanel />
      </div>

      <Card className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatMessagesList messages={messages} isLoading={isLoading} />
          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} />
        </div>
      </Card>
    </div>
  )
}
