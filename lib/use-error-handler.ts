"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { AppError, handleError, type ErrorCode } from "./error-handler"

export function useErrorHandler() {
  const router = useRouter()

  const showError = useCallback(
    (error: unknown) => {
      const appError = handleError(error)
      console.error("[v0] Error handled:", appError)
      router.push(`/error/${appError.code}`)
    },
    [router],
  )

  const showErrorCode = useCallback(
    (code: ErrorCode) => {
      router.push(`/error/${code}`)
    },
    [router],
  )

  const throwError = useCallback((code: ErrorCode, message?: string) => {
    throw new AppError(code, message)
  }, [])

  return {
    showError,
    showErrorCode,
    throwError,
  }
}
