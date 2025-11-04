"use client"

import { useEffect } from "react"
import { ErrorPage } from "@/components/error-page"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error caught by error boundary:", error)
  }, [error])

  return <ErrorPage code={500} reset={reset} />
}
