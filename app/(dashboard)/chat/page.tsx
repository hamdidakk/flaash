"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { ChatSettingsPanel } from "@/components/chat/chat-settings-panel"
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

export default function ChatPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<RagMessage[]>(initialChatMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])

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
      const assistantMessage = simulateRagResponse(userMessage.content)
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
        <ChatSettingsPanel />
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
