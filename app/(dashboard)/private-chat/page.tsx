"use client"

import { useCallback, useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { ChatSettingsPanel, type ChatSettings } from "@/components/chat/chat-settings-panel"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { type RagMessage, type CitationLink, type ChunkRecord } from "@/lib/types"
import { ragGeneration, getDocumentChunksByName } from "@/lib/dakkom-api"
import { AppError } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

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
  const [messages, setMessages] = useState<RagMessage[]>([
    {
      id: "assistant_welcome",
      role: "assistant",
      content:
        "Bonjour ! Pose-moi une question sur tes documents et je te donnerai une réponse sourcée avec les passages pertinents.",
      citations: [],
      timestamp: "À l'instant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [throttledReason, setThrottledReason] = useState<string | null>(null)

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
    if (throttledReason) return
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

    try {
      const payload: Record<string, unknown> = {
        query: userMessage.content,
        collection_name: "document_collection",
        temperature: settings.temperature,
        prompt: settings.promptType,
        model: settings.model,
      }

      const res = await ragGeneration(payload)

      const citations: CitationLink[] = (res.retrieved_documents ?? []).map((doc: any, idx: number) => ({
        id: `${doc.chunk_id ?? idx}`,
        chunkId: doc.chunk_id ?? String(idx),
        documentId: doc.source_file ?? "",
        document: doc.source_file ?? "",
        page: undefined,
        contentPreview: doc.document ?? "",
        score: typeof doc.probability === "number" ? doc.probability : undefined,
      }))

      const retrievedDocuments = citations.map((c, idx) => ({
        id: `${c.chunkId}_${idx}`,
        chunkId: c.chunkId,
        documentId: c.documentId,
        documentName: c.document,
        snippet: c.contentPreview,
        score: c.score,
        metadata: {},
      }))

      const assistantMessage: RagMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: res.generated_response?.text ?? "",
        citations,
        retrievedDocuments,
        metadata: {
          model: settings.model,
          temperature: settings.temperature,
          promptType: settings.promptType,
          collectionId: settings.collectionId,
        },
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setThrottledReason(null)
    } catch (e) {
      if (e instanceof AppError && e.throttled) {
        setThrottledReason(e.message || t("throttling.description"))
        return
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_error_${Date.now()}`,
          role: "assistant",
          content: t("errors.generic.description"),
          citations: [],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCitationClick = async (citation: CitationLink) => {
    setChunkDialogDocument(citation.document)
    try {
      const res = await getDocumentChunksByName(citation.document)
      const chunks: ChunkRecord[] = res.chunks.map((c: any) => ({ id: c.id, content: c.value }))
      setChunkDialogContent(chunks)
    } catch {
      setChunkDialogContent([])
    }
    setIsChunkDialogOpen(true)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title={t("chat.title")} description={t("chat.description")} />
        <ChatSettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
      </div>
      {throttledReason && <ThrottlingAlert reason={throttledReason} onRetry={() => setThrottledReason(null)} />}

      <Card className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatMessagesList messages={messages} isLoading={isLoading} onCitationClick={handleCitationClick} />
          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading || Boolean(throttledReason)} />
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


