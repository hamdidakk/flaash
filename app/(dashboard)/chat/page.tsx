"use client"

import { useCallback, useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { ChatSettingsPanel, type ChatSettings } from "@/components/chat/chat-settings-panel"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import {
  initialChatMessages,
  simulateRagResponse,
  findChunkById,
  getChunksForDocument,
  type RagMessage,
  type CitationLink,
  type ChunkRecord,
} from "@/lib/mock-data"

const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  model: "gpt-4o",
  temperature: 0.7,
  systemPrompt:
    "You are a helpful assistant that answers questions based on the provided documents. Always cite your sources.",
  promptType: "short",
  collectionId: "all",
}

export default function ChatPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_CHAT_SETTINGS)
  const [messages, setMessages] = useState<RagMessage[]>(initialChatMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const storedSettings = window.localStorage.getItem("rag-chat-settings")
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings)
        setSettings((prev) => ({ ...prev, ...parsed }))
      }

      const storedMessages = window.localStorage.getItem("rag-chat-history")
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to hydrate chat state:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    try {
      window.localStorage.setItem("rag-chat-settings", JSON.stringify(settings))
    } catch (error) {
      console.error("[v0] Failed to persist chat settings:", error)
    }
  }, [settings, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    try {
      window.localStorage.setItem("rag-chat-history", JSON.stringify(messages))
    } catch (error) {
      console.error("[v0] Failed to persist chat history:", error)
    }
  }, [messages, isHydrated])

  const handleSettingsChange = useCallback((update: Partial<ChatSettings>) => {
    setSettings((prev) => ({ ...prev, ...update }))
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: RagMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input,
      citations: [],
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simule une latence réseau
    setTimeout(() => {
      const assistantMessage = simulateRagResponse(userMessage.content, {
        collectionId: settings.collectionId,
        promptType: settings.promptType,
        model: settings.model,
        temperature: settings.temperature,
      })
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleCitationClick = (citation: CitationLink) => {
    const chunk = findChunkById(citation.chunkId)
    const documentChunks = chunk ? [chunk] : getChunksForDocument(citation.documentId)

    setChunkDialogDocument(citation.document)
    setChunkDialogContent(documentChunks)
    setIsChunkDialogOpen(true)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title={t("chat.title")} description={t("chat.description")} />
        <ChatSettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
      </div>

      <Card className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatMessagesList messages={messages} isLoading={isLoading} onCitationClick={handleCitationClick} />
          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} />
        </div>
      </Card>

      <ChunksDialog
        open={isChunkDialogOpen}
        onOpenChange={setIsChunkDialogOpen}
        documentName={chunkDialogDocument}
        chunks={chunkDialogContent}
      />
    </div>
  )
}
