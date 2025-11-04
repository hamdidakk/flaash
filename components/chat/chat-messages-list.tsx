"use client"

import { ChatMessage } from "@/components/chat-message"

interface Message {
  id: number | string
  role: string
  content: string
  citations: any[]
}

interface ChatMessagesListProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatMessagesList({ messages, isLoading }: ChatMessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <ChatMessage
          message={{
            id: "loading",
            role: "assistant",
            content: "Thinking...",
            citations: [],
          }}
        />
      )}
    </div>
  )
}
