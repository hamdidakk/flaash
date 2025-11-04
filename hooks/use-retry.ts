"use client"

import { useState, useCallback } from "react"
import { withRetry, type RetryConfig } from "@/lib/error-handler"

interface UseRetryOptions extends Partial<RetryConfig> {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useRetry<T>(fn: () => Promise<T>, options: UseRetryOptions = {}) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setIsRetrying(true)
    setError(null)

    try {
      const result = await withRetry(fn, {
        maxRetries: options.maxRetries ?? 3,
        delayMs: options.delayMs ?? 1000,
        backoff: options.backoff ?? true,
      })

      options.onSuccess?.()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsRetrying(false)
    }
  }, [fn, options])

  return { execute, isRetrying, error }
}
