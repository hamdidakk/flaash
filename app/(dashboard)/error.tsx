"use client"

import { useEffect } from "react"
import { ErrorPage } from "@/components/error-page"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Dashboard error:", error)
  }, [error])

  return <ErrorPage code={500} reset={reset} />
}
