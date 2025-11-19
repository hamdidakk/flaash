"use client"

import { useCallback, useEffect, useState } from "react"

export interface UploadHistoryEntry {
  id: string
  name: string
  size: number
  source: string
  status: "success" | "error" | "confirmed"
  timestamp: number
  message?: string
  confirmedAt?: number
}

const STORAGE_KEY = "rag:upload-history"
const DEFAULT_LIMIT = 15

export function useUploadHistory(limit = DEFAULT_LIMIT) {
  const [history, setHistory] = useState<UploadHistoryEntry[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UploadHistoryEntry[]
        setHistory(parsed.slice(0, limit))
      }
    } catch {
      // Ignore parse errors
    }
  }, [limit])

  const persist = useCallback((entries: UploadHistoryEntry[]) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // Ignore storage errors
    }
  }, [])

  const addHistoryEntry = useCallback(
    (entry: UploadHistoryEntry) => {
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, limit)
        persist(next)
        return next
      })
    },
    [limit, persist],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Ignore storage errors
      }
    }
  }, [])

  const markConfirmed = useCallback(
    (fileName: string) => {
      setHistory((prev) => {
        const updated = prev.map((entry) =>
          entry.name === fileName && entry.status === "success"
            ? { ...entry, status: "confirmed" as const, confirmedAt: Date.now() }
            : entry,
        )
        persist(updated)
        return updated
      })
    },
    [persist],
  )

  return { history, addHistoryEntry, clearHistory, markConfirmed }
}

