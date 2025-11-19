"use client"

import { useCallback, useEffect, useState } from "react"

export type ToolHistoryPanel = "documents" | "search" | "rag" | "evaluation"

export interface ToolHistoryEntry {
  id: string
  panel: ToolHistoryPanel
  params: Record<string, unknown>
  summary: string
  success: boolean
  timestamp: number
}

export type ToolHistoryEntryInput = Omit<ToolHistoryEntry, "id" | "timestamp">

const STORAGE_KEY = "tool-history"
const DEFAULT_LIMIT = 20

function safeParseHistory(value: string | null): ToolHistoryEntry[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((entry) => entry && entry.id && entry.panel)
    }
    return []
  } catch {
    return []
  }
}

export function useToolHistory(limit = DEFAULT_LIMIT) {
  const [entries, setEntries] = useState<ToolHistoryEntry[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = safeParseHistory(window.localStorage.getItem(STORAGE_KEY))
    setEntries(stored.slice(0, limit))
  }, [limit])

  const persist = useCallback((next: ToolHistoryEntry[]) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addEntry = useCallback(
    (entry: ToolHistoryEntryInput) => {
      setEntries((prev) => {
        const newEntry: ToolHistoryEntry = {
          ...entry,
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        }
        const next = [newEntry, ...prev].slice(0, limit)
        persist(next)
        return next
      })
    },
    [limit, persist],
  )

  const clearHistory = useCallback(() => {
    setEntries([])
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  return {
    entries,
    addEntry,
    clearHistory,
  }
}

