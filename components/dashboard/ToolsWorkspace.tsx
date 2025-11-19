"use client"

import { useCallback } from "react"
import { DocumentListPanel, EvaluationPanel, RagPanel, SearchPanel } from "@/components/tools/panels"
import { ToolHistoryList } from "@/components/tools/history-list"
import { useToolHistory } from "@/hooks/use-tool-history"
import { trackEvent } from "@/lib/analytics"

export function ToolsWorkspace() {
  const { entries, addEntry, clearHistory } = useToolHistory()

  const handleHistory = useCallback(
    (entry: Parameters<typeof addEntry>[0]) => {
      addEntry(entry)
    },
    [addEntry],
  )

  const handleTrack = useCallback((event: string, payload?: Record<string, unknown>) => {
    trackEvent(event, payload)
  }, [])

  return (
    <div className="grid gap-6">
      <DocumentListPanel onHistory={handleHistory} onTrack={handleTrack} context="dashboard" />
      <SearchPanel onHistory={handleHistory} onTrack={handleTrack} context="dashboard" />
      <RagPanel onHistory={handleHistory} onTrack={handleTrack} context="dashboard" />
      <EvaluationPanel onHistory={handleHistory} onTrack={handleTrack} context="dashboard" />
      <ToolHistoryList entries={entries} onClear={clearHistory} />
    </div>
  )
}

