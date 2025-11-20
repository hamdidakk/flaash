"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChatMessagesList } from "@/components/chat/chat-messages-list"
import { ChatInput } from "@/components/chat/chat-input"
import { WidgetHeader } from "@/components/public/chat/WidgetHeader"
import { PromptsChips } from "@/components/public/chat/PromptsChips"
import { TypingIndicator } from "@/components/public/chat/TypingIndicator"
import type { RagMessage, CitationLink, ChunkRecord } from "@/lib/types"
import { getDocumentChunksByName, ragGenerationPublic } from "@/lib/dakkom-api"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { SourceModal } from "@/components/public/SourceModal"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { AppError } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { useSessionStore } from "@/store/session-store"

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
  const LOGIN_MODAL_TIMESTAMP_KEY = "public-chat:login-modal-timestamp"
  const LOGIN_MODAL_DURATION_MS = 24 * 60 * 60 * 1000 // 24 heures
  const [requestCount, setRequestCount] = useState(0)
  const [showUpsell, setShowUpsell] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const MIN_INTERVAL_MS = 2000
  const [lastRequestAt, setLastRequestAt] = useState(0)
  const [cooldownLeftMs, setCooldownLeftMs] = useState(0)
  const [throttledReason, setThrottledReason] = useState<string | null>(null)
  const { status } = useSessionStore()

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

      // Vérifier si le modal de connexion doit être affiché
      if (safeValue >= REQUEST_LIMIT && typeof window !== "undefined") {
        const timestampStr = window.localStorage.getItem(LOGIN_MODAL_TIMESTAMP_KEY)
        if (timestampStr) {
          const timestamp = parseInt(timestampStr, 10)
          const now = Date.now()
          const elapsed = now - timestamp
          // Si moins de 24h se sont écoulées, afficher le modal
          if (elapsed < LOGIN_MODAL_DURATION_MS && !Number.isNaN(timestamp)) {
            setShowLoginModal(true)
          } else {
            // Plus de 24h, nettoyer le localStorage
            window.localStorage.removeItem(LOGIN_MODAL_TIMESTAMP_KEY)
          }
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fermer le modal après connexion réussie
  useEffect(() => {
    if (status === "authenticated" && showLoginModal) {
      setShowLoginModal(false)
      // Nettoyer le timestamp après connexion
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOGIN_MODAL_TIMESTAMP_KEY)
      }
    }
  }, [status, showLoginModal])

  const handleSend = async (overrideText?: string) => {
    if (throttledReason) {
      return
    }
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
        if (next >= REQUEST_LIMIT) {
          setShowUpsell(true)
          // Afficher le modal de connexion et stocker le timestamp
          setShowLoginModal(true)
          if (typeof window !== "undefined") {
            window.localStorage.setItem(LOGIN_MODAL_TIMESTAMP_KEY, String(Date.now()))
          }
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
        {showUpsell && (
          <div className="public-widget__upsell">
            <div className="font-medium">{TEXT.upsellTitle}</div>
            <p className="mt-1">{TEXT.upsellBody(REQUEST_LIMIT)}</p>
            <div className="public-widget__upsell-actions">
              <Link href="/admin" className="public-widget__upsell-link">{TEXT.login}</Link>
              <span className="public-widget__upsell-separator">·</span>
              <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="public-widget__upsell-link">{TEXT.subscribe}</a>
              <span className="public-widget__upsell-separator">·</span>
              <Link href="/guide" className="public-widget__upsell-link">{TEXT.more}</Link>
            </div>
          </div>
        )}
        {throttledReason && <ThrottlingAlert reason={throttledReason} onRetry={() => setThrottledReason(null)} />}
        {messages.length <= 1 && (
          <div className="public-widget__welcome">
            <p>Bienvenue 👋</p>
            <p>Posez vos questions sur les articles, les thèmes et les futurs possibles explorés par FLAASH.</p>
          </div>
        )}
        <div className="public-widget__body">
          <ChatMessagesList messages={messages} isLoading={isLoading} onCitationClick={handleCitationClick} />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            disabled={isLoading || showUpsell || cooldownLeftMs > 0 || Boolean(throttledReason)}
          />
          {cooldownLeftMs > 0 && (
            <p className="public-widget__cooldown">{TEXT.cooldown(Math.ceil(cooldownLeftMs / 1000))}</p>
          )}
          <PromptsChips
            prompts={TEXT.prompts}
            disabled={isLoading || showUpsell || cooldownLeftMs > 0 || Boolean(throttledReason)}
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

      {/* Modal de connexion après 3 questions */}
      <Dialog
        open={showLoginModal}
        onOpenChange={(open) => {
          // Empêcher la fermeture manuelle du modal (il doit rester ouvert jusqu'à connexion ou 24h)
          // Seule la connexion réussie peut fermer le modal
          if (open || status === "authenticated") {
            setShowLoginModal(open)
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md"
          onInteractOutside={(e) => {
            // Empêcher la fermeture en cliquant en dehors
            e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            // Empêcher la fermeture avec Escape
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("auth.login")}</DialogTitle>
            <DialogDescription>
              {language === "fr"
                ? "Vous avez atteint la limite de 3 questions gratuites. Connectez-vous pour continuer à utiliser le chat."
                : "You've reached the limit of 3 free questions. Sign in to continue using the chat."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <LoginForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


