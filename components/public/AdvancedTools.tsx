"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DocumentListPanel, EvaluationPanel, RagPanel, SearchPanel } from "@/components/tools/panels"
import { useSessionStore } from "@/store/session-store"
import { cn } from "@/lib/utils"
import { ToolHistoryList } from "@/components/tools/history-list"
import { useToolHistory } from "@/hooks/use-tool-history"
import { trackEvent } from "@/lib/analytics"

export function AdvancedTools() {
  const { status, user } = useSessionStore()
  const [open, setOpen] = useState(false)
  const isAuthenticated = status === "authenticated"
  const isAdmin = useMemo(() => {
    if (!user) return false
    return ["admin", "manager", "staff"].includes(String(user.role))
  }, [user])
  const { entries, addEntry, clearHistory } = useToolHistory()

  const handleHistory = useCallback(
    (entry: Parameters<typeof addEntry>[0]) => {
      addEntry(entry)
    },
    [addEntry],
  )

  const handleTrack = useCallback((event: string, payload?: Record<string, unknown>) => {
    trackEvent(event, { source: "chat", ...(payload ?? {}) })
  }, [])

  if (!isAuthenticated) {
    return (
      <Card className="mt-6 border-dashed border-muted-foreground/40 card-surface-light p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="public-section-title">Outils avancés</p>
            <p className="public-section-description">
              Connectez-vous pour accéder aux outils RAG (recherche vectorielle, génération et suivi des documents).
            </p>
          </div>
          <Button asChild className="mt-2 cta-accent md:mt-0">
            <Link href="/login?redirect=/chat">Se connecter</Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mt-6 card-surface-light p-6">
      <div className="public-card-muted__header">
        <div>
          <div className="flex items-center gap-2">
            <p className="public-section-title">Outils avancés</p>
            {!isAdmin && <Badge variant="secondary">Mode limité</Badge>}
          </div>
          <p className="public-section-description">
            Accédez aux mêmes commandes que l’équipe éditoriale pour interroger le vector store ou lancer des RAG tests.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap cta-accent">
              Ouvrir les outils
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Outils RAG avancés</DialogTitle>
              <DialogDescription>
                Ces outils appellent directement l’API Dakkom. Les actions sont limitées selon votre rôle.
              </DialogDescription>
            </DialogHeader>
            <div className={cn("public-section-body py-4")}>
              <DocumentListPanel onHistory={handleHistory} onTrack={handleTrack} context="chat" />
              <SearchPanel
                maxResults={isAdmin ? 20 : 5}
                disabled={!isAdmin}
                onHistory={handleHistory}
                onTrack={handleTrack}
                context="chat"
              />
              <RagPanel
                allowTemperature={isAdmin}
                allowPromptSelection={true}
                disabled={!isAdmin}
                onHistory={handleHistory}
                onTrack={handleTrack}
                context="chat"
              />
              {isAdmin ? (
                <EvaluationPanel onHistory={handleHistory} onTrack={handleTrack} context="chat" />
              ) : (
                <EvaluationPanel disabled onHistory={handleHistory} onTrack={handleTrack} context="chat" />
              )}
              <ToolHistoryList entries={entries} onClear={clearHistory} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}

