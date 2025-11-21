"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import { WidgetHeader } from "@/components/public/chat/WidgetHeader"
import { PromptsChips } from "@/components/public/chat/PromptsChips"
import type { RagMessage, CitationLink, ChunkRecord } from "@/lib/types"
import { getDocumentChunksByName, ragGenerationPublic } from "@/lib/dakkom-api"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { SourceModal } from "@/components/public/SourceModal"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { AppError } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DakkomRetrievedDocument } from "@/lib/dakkom-api"

const KNOWN_METADATA_KEYS = ["source", "author", "theme", "topic", "category", "url", "collection", "language"]

const extractDocumentMetadata = (doc: DakkomRetrievedDocument): Record<string, string> => {
  const metadata: Record<string, string> = {}

  const assignIfString = (key: string, value: unknown) => {
    if (typeof value === "string" && value.trim().length > 0) {
      metadata[key] = value.trim()
    }
  }

  KNOWN_METADATA_KEYS.forEach((key) => {
    if (key in doc) {
      assignIfString(key, (doc as Record<string, unknown>)[key])
    }
  })

  if (typeof (doc as Record<string, unknown>).source_type === "string") {
    assignIfString("source_type", (doc as Record<string, unknown>).source_type)
  }

  if (doc.metadata && typeof doc.metadata === "object") {
    Object.entries(doc.metadata).forEach(([key, value]) => {
      if (!(key in metadata)) {
        assignIfString(key, value)
      }
    })
  }

  return metadata
}

type NormalizedDocument = {
  chunkId: string
  documentId: string
  documentName: string
  snippet: string
  score?: number
  metadata: Record<string, string>
}

export function PublicWidget() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()

  const TEXT = useMemo(() => {
    if (language === "en") {
      return {
        title: "Flaash Assistant",
        welcome: "Hello! Ask a question about Flaash content.",
        upsellTitle: "Limit reached",
        upsellBody: (limit: number) => `You reached the free limit of ${limit} requests.`,
        login: "Sign in",
        subscribe: "Subscribe / Buy",
        more: "Learn more",
        responseType: "Response type",
        short: "Short",
        long: "Long",
        cooldown: (s: number) => `Please wait ${s}s…`,
        prompts: [
          "How do cities monitor their citizens?",
          "AI and justice",
          "Data centers footprint",
          "Learning and AI",
        ],
        source: "View source",
        shop: "FLAASH Shop",
      }
    }
    return {
      title: "Assistant Flaash",
      welcome: "Bonjour ! Posez une question sur les contenus Flaash.",
      upsellTitle: "Limite atteinte",
      upsellBody: (limit: number) => `Vous avez atteint la limite de ${limit} requêtes gratuites.`,
      login: "Se connecter",
      subscribe: "S’abonner / Acheter",
        more: "En savoir plus",
        responseType: "Type de réponse",
        short: "Réponse courte",
        long: "Réponse longue",
      cooldown: (s: number) => `Veuillez patienter ${s}s…`,
      prompts: [
        "Comment les villes surveillent-elles leurs citoyens ?",
        "IA et justice",
        "Empreinte des data centers",
        "Apprentissages et IA",
      ],
      source: "Voir la source",
      shop: "Boutique FLAASH",
    }
  }, [language])

  const [messages, setMessages] = useState<RagMessage[]>([
    { id: "welcome", role: "assistant", content: TEXT.welcome, citations: [] },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false)
  const [sourceDocument, setSourceDocument] = useState<string | undefined>()
  const [sourceLinks, setSourceLinks] = useState<Array<{ label: string; href: string }>>([])
  const [responseType, setResponseType] = useState<"short" | "long">("short")
  const COUNT_STORAGE_KEY = "public-chat:requests-count"
  const [requestCount, setRequestCount] = useState(0)
  const MIN_INTERVAL_MS = 2000
  const [lastRequestAt, setLastRequestAt] = useState(0)
  const [cooldownLeftMs, setCooldownLeftMs] = useState(0)
  const [throttledReason, setThrottledReason] = useState<string | null>(null)

  // Ensure welcome message reflects current language
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: "welcome", role: "assistant", content: TEXT.welcome, citations: [] }]
      }
      if (prev[0]?.id === "welcome" && prev[0]?.content !== TEXT.welcome) {
        const next = [...prev]
        next[0] = { ...next[0], content: TEXT.welcome }
        return next
      }
      return prev
    })
  }, [TEXT.welcome])

  useEffect(() => {
    const prefill = searchParams?.get("prefill")
    if (prefill) setInput(prefill)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(COUNT_STORAGE_KEY) : null
      const value = raw ? parseInt(raw, 10) : 0
      const safeValue = Number.isNaN(value) ? 0 : value
      setRequestCount(safeValue)
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleSend = async (overrideText?: string) => {
    if (throttledReason) {
      return
    }
    const now = Date.now()
    const elapsed = now - lastRequestAt
    if (elapsed < MIN_INTERVAL_MS) {
      const left = MIN_INTERVAL_MS - elapsed
      setCooldownLeftMs(left)
      setTimeout(() => setCooldownLeftMs(0), left)
      return
    }
    const base = overrideText ?? input
    if (!base.trim()) return
    const question = base.trim()
    setInput("")
    setIsLoading(true)
    setLastRequestAt(now)
    setMessages((prev) => [...prev, { id: `user_${Date.now()}`, role: "user", content: question, citations: [] }])
    trackEvent("ask", { source: "public_widget", length: question.length })
    try {
      const res = await ragGenerationPublic({ query: question, prompt: "v2", temperature: 0.5, response_length: responseType })
      const retrieved = (res as any).retrieved_documents ?? []
      const normalizedDocuments: NormalizedDocument[] = retrieved.map((doc: DakkomRetrievedDocument, idx: number) => {
        const chunkId = doc.chunk_id ?? String(idx)
        const documentId = doc.source_file ?? doc.document_id ?? ""
        const documentName = doc.source_file ?? doc.document ?? `Document ${idx + 1}`
        return {
          chunkId,
          documentId,
          documentName,
          snippet: (doc as any).document ?? (doc as any).content ?? "",
          score: typeof doc.probability === "number" ? doc.probability : undefined,
          metadata: extractDocumentMetadata(doc),
        }
      })

      const citations: CitationLink[] = normalizedDocuments.map((doc, idx) => ({
        id: `${doc.chunkId}_${idx}`,
        chunkId: doc.chunkId,
        documentId: doc.documentId,
        document: doc.documentName,
        page: undefined,
        contentPreview: doc.snippet,
        score: doc.score,
      }))
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: (res as any).generated_response?.text ?? t("errors.generic.description"),
          citations,
          metadata: { promptType: responseType },
          retrievedDocuments: normalizedDocuments.map((doc, i) => ({
            id: `${doc.chunkId}_${i}`,
            chunkId: doc.chunkId,
            documentId: doc.documentId,
            documentName: doc.documentName,
            snippet: doc.snippet,
            score: doc.score,
            metadata: doc.metadata,
          })),
        },
      ])
      try {
        const next = requestCount + 1
        setRequestCount(next)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(COUNT_STORAGE_KEY, String(next))
        }
      } catch {
        // ignore
      }
      setThrottledReason(null)
    } catch (error) {
      if (error instanceof AppError && error.throttled) {
        setThrottledReason(error.message || t("throttling.description"))
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `assistant_err_${Date.now()}`, role: "assistant", content: t("errors.generic.description"), citations: [] },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCitationClick = async (citation: CitationLink) => {
    setChunkDialogDocument(citation.document)
    setSourceDocument(citation.document)
    try {
      const res = await getDocumentChunksByName(citation.document)
      const chunks: ChunkRecord[] = res.chunks.map((c: any) => ({ id: c.id, content: c.value }))
      setChunkDialogContent(chunks)
      const urls = Array.from(new Set(res.chunks.map((c: any) => c.url).filter((u: string) => !!u)))
      const links = urls.map((u: string) => ({ label: TEXT.source, href: u }))
      if (links.length === 0) {
        links.push({ label: TEXT.shop, href: "https://boutique.flaash.fr" })
      }
      setSourceLinks(links)
    } catch {
      setChunkDialogContent([])
      setSourceLinks([{ label: TEXT.shop, href: "https://boutique.flaash.fr" }])
    }
    setIsSourceModalOpen(true)
  }

  const handleViewExcerpts = () => {
    setIsSourceModalOpen(false)
    setIsChunkDialogOpen(true)
  }

  return (
    <div className="public-widget">
      <Card className="public-widget__card">
        <WidgetHeader title={TEXT.title} subtitle="explorateur du futur — formé sur les publications et analyses de la revue" />
        {throttledReason && <ThrottlingAlert reason={throttledReason} onRetry={() => setThrottledReason(null)} />}
        {messages.length <= 1 && (
          <div className="public-widget__welcome">
            <p>Bienvenue 👋</p>
            <p>Posez vos questions sur les articles, les thèmes et les futurs possibles explorés par FLAASH.</p>
          </div>
        )}
        <div className="public-widget__body">
          <div className="public-widget__response-type">
            <span>{TEXT.responseType}</span>
            <Select value={responseType} onValueChange={(val) => setResponseType(val as "short" | "long")}>
              <SelectTrigger className="public-widget__response-type-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short" className="public-widget__response-type-item">
                  {TEXT.short}
                </SelectItem>
                <SelectItem value="long" className="public-widget__response-type-item">
                  {TEXT.long}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ChatMessagesList messages={messages} isLoading={isLoading} onCitationClick={handleCitationClick} />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            disabled={isLoading || cooldownLeftMs > 0 || Boolean(throttledReason)}
          />
          {cooldownLeftMs > 0 && (
            <p className="public-widget__cooldown">{TEXT.cooldown(Math.ceil(cooldownLeftMs / 1000))}</p>
          )}
          <PromptsChips
            prompts={TEXT.prompts}
            disabled={isLoading || cooldownLeftMs > 0 || Boolean(throttledReason)}
            onPick={(q) => handleSend(q)}
          />
        </div>
      </Card>

      <SourceModal
        open={isSourceModalOpen}
        onOpenChange={setIsSourceModalOpen}
        documentName={sourceDocument}
        links={sourceLinks}
        onViewExcerpts={handleViewExcerpts}
      />

      <ChunksDialog
        open={isChunkDialogOpen}
        onOpenChange={setIsChunkDialogOpen}
        documentName={chunkDialogDocument}
        chunks={chunkDialogContent}
      />

    </div>
  )
}


