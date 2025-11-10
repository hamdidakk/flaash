"use client"

import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "@/components/chat-message"
import type { RagMessage, CitationLink } from "@/lib/types"

interface ChatMessagesListProps {
  messages: RagMessage[]
  isLoading?: boolean
  onCitationClick?: (citation: CitationLink) => void
}

export function ChatMessagesList({ messages, isLoading, onCitationClick }: ChatMessagesListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, isLoading])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
      setShowScroll(!nearBottom)
    }
    onScroll()
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        className="h-full space-y-4 overflow-y-auto p-6"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={isLoading ? "true" : "false"}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onCitationClick={onCitationClick} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">🤖</div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              <span className="inline-flex animate-pulse">…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showScroll && (
        <button
          type="button"
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-3 right-3 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs text-gray-700 shadow-sm backdrop-blur hover:bg-white"
          aria-label="Faire défiler jusqu’en bas"
        >
          ↓ Bas
        </button>
      )}
    </div>
  )
}
