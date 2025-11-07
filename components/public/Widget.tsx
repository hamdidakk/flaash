"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import type { RagMessage, CitationLink, ChunkRecord } from "@/lib/types"
import { getDocumentChunksByName, ragGenerationPublic } from "@/lib/dakkom-api"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { SourceModal } from "@/components/public/SourceModal"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

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
  const REQUEST_LIMIT = 3
  const COUNT_STORAGE_KEY = "public-chat:requests-count"
  const [requestCount, setRequestCount] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const MIN_INTERVAL_MS = 2000
  const [lastRequestAt, setLastRequestAt] = useState(0)
  const [cooldownLeftMs, setCooldownLeftMs] = useState(0)

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
      if (safeValue >= REQUEST_LIMIT) setShowUpsell(true)
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = async (overrideText?: string) => {
    if (showUpsell || requestCount >= REQUEST_LIMIT) {
      setShowUpsell(true)
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
      const res = await ragGenerationPublic({ query: question, prompt: "v2", temperature: 0.5 })
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
      try {
        const next = requestCount + 1
        setRequestCount(next)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(COUNT_STORAGE_KEY, String(next))
        }
        if (next >= REQUEST_LIMIT) setShowUpsell(true)
      } catch {
        // ignore
      }
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
    <div className="mx-auto w-full p-0">
      <Card className="flex w-full flex-col rounded-2xl border border-gray-100 bg-white p-0 shadow-md">
        <div className="px-6 pt-6">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span aria-hidden>🤖</span> Assistant FLAASH
          </h2>
          <p className="mb-4 text-sm text-gray-600">explorateur du futur — formé sur les publications et analyses de la revue</p>
        </div>
        {showUpsell && (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <div className="font-medium">{TEXT.upsellTitle}</div>
            <p className="mt-1">{TEXT.upsellBody(REQUEST_LIMIT)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Link href="/admin" className="underline">{TEXT.login}</Link>
              <span className="opacity-60">·</span>
              <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="underline">{TEXT.subscribe}</a>
              <span className="opacity-60">·</span>
              <Link href="/guide" className="underline">{TEXT.more}</Link>
            </div>
          </div>
        )}
        {messages.length <= 1 && (
          <div className="px-6 text-center text-sm text-gray-600">
            <p>Bienvenue 👋</p>
            <p>Posez vos questions sur les articles, les thèmes et les futurs possibles explorés par FLAASH.</p>
          </div>
        )}
        <div className="flex min-h-[60vh] max-h-[calc(100dvh-220px)] flex-col">
          <ChatMessagesList messages={messages} isLoading={isLoading} onCitationClick={handleCitationClick} />
          <ChatInput value={input} onChange={setInput} onSend={() => handleSend()} disabled={isLoading || showUpsell || cooldownLeftMs > 0} />
          {cooldownLeftMs > 0 && (
            <p className="text-center text-xs text-muted-foreground">{TEXT.cooldown(Math.ceil(cooldownLeftMs / 1000))}</p>
          )}
          <div className="flex flex-wrap gap-2 px-6 pb-6 pt-1">
            {TEXT.prompts.map((q) => (
              <Button
                key={q}
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto rounded-lg bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                disabled={isLoading || showUpsell || cooldownLeftMs > 0}
                onClick={() => handleSend(q)}
              >
                {q}
              </Button>
            ))}
          </div>
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


