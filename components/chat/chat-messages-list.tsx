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
    <div
      className="flex-1 overflow-y-auto p-6 space-y-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-busy={isLoading ? "true" : "false"}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onCitationClick={onCitationClick} />
      ))}
      {isLoading && (
        <ChatMessage
          message={{
            id: "loading",
            role: "assistant",
            content: "En cours de génération…",
            citations: [],
          }}
        />
      )}
    </div>
  )
}
