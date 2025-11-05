"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import type { RagMessage, CitationLink, ChunkRecord } from "@/lib/types"
import { getDocumentChunksByName, ragGeneration } from "@/lib/dakkom-api"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { useLanguage } from "@/lib/language-context"

export function PublicWidget() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<RagMessage[]>([
    { id: "welcome", role: "assistant", content: "Bonjour ! Posez une question sur les contenus Flaash.", citations: [] },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])

  const handleSend = async () => {
    if (!input.trim()) return
    const question = input.trim()
    setInput("")
    setIsLoading(true)
    setMessages((prev) => [...prev, { id: `user_${Date.now()}`, role: "user", content: question, citations: [] }])
    try {
      const res = await ragGeneration({ query: question, prompt: "v2", temperature: 0.5 })
      const retrieved = (res as any).retrieved_documents ?? []
      const citations: CitationLink[] = retrieved.map((doc: any, idx: number) => ({
        id: `${doc.chunk_id ?? idx}`,
        chunkId: doc.chunk_id ?? String(idx),
        documentId: doc.source_file ?? "",
        document: doc.source_file ?? "",
        page: undefined,
        contentPreview: doc.document ?? "",
        score: typeof doc.probability === "number" ? doc.probability : undefined,
      }))
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: (res as any).generated_response?.text ?? t("errors.generic.description"),
          citations,
          retrievedDocuments: citations.map((c, i) => ({
            id: `${c.chunkId}_${i}`,
            chunkId: c.chunkId,
            documentId: c.documentId,
            documentName: c.document,
            snippet: c.contentPreview,
            score: c.score,
            metadata: {},
          })),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `assistant_err_${Date.now()}`, role: "assistant", content: t("errors.generic.description"), citations: [] },
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-4">
        <h1 className="mb-2 text-xl font-semibold">Assistant Flaash</h1>
        <div className="flex h-[70vh] flex-col">
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


