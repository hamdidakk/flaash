"use client"

import { useEffect } from "react"
import { ErrorPage } from "@/components/error-page"
import { PublicFooter } from "@/components/public/PublicFooter"

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

  return (
    <div style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <ErrorPage code={500} reset={reset} />
      <PublicFooter />
    </div>
  )
}
