"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ToolHistoryEntry } from "@/hooks/use-tool-history"
import { cn } from "@/lib/utils"

const PANEL_LABELS: Record<ToolHistoryEntry["panel"], string> = {
  documents: "Liste des documents",
  search: "Recherche vectorielle",
  rag: "Génération RAG",
  evaluation: "Évaluation",
}

interface ToolHistoryListProps {
  entries: ToolHistoryEntry[]
  onClear: () => void
  className?: string
}

export function ToolHistoryList({ entries, onClear, className }: ToolHistoryListProps) {
  return (
    <Card className={cn("space-y-4 border-dashed border-muted-foreground/40 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Historique</p>
          <p className="text-xs text-muted-foreground">Dernières actions effectuées sur les outils.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClear} disabled={entries.length === 0}>
          Vider
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aucune action enregistrée pour le moment.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-md border bg-white/80 p-3 text-xs shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{PANEL_LABELS[entry.panel]}</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-foreground">{entry.summary}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={entry.success ? "default" : "destructive"} className="text-[10px] uppercase tracking-wide">
                  {entry.success ? "Succès" : "Erreur"}
                </Badge>
                <pre className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground">
                  {JSON.stringify(entry.params)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

