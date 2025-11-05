"use client"

import { ChatMessage } from "@/components/chat-message"
import type { RagMessage, CitationLink } from "@/lib/types"

interface ChatMessagesListProps {
  messages: RagMessage[]
  isLoading?: boolean
  onCitationClick?: (citation: CitationLink) => void
}

export function ChatMessagesList({ messages, isLoading, onCitationClick }: ChatMessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onCitationClick={onCitationClick} />
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
