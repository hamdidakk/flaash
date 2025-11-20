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
  const { user } = useSessionStore()
  const [open, setOpen] = useState(false)
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
            <Button variant={undefined} className="whitespace-nowrap dashboard-cta-accent">
              Ouvrir les outils
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Outils RAG avancés</DialogTitle>
              <DialogDescription>
                Ces outils appellent directement l'API Dakkom. Les actions sont limitées selon votre rôle.
              </DialogDescription>
            </DialogHeader>
            <div className={cn("public-section-body py-4 space-y-6")}>
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

