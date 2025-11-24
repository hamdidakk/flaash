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
    // Ne pas logger les erreurs 401 (authentification) car elles sont normales après déconnexion
    // Ces erreurs sont gérées silencieusement par les composants
    const isAuthError = error instanceof Error && (
      error.message.includes("Authentication credentials were not provided") ||
      error.message.includes("authentication") ||
      error.message.includes("401")
    )
    
    if (!isAuthError) {
      console.error("[v0] Error caught by error boundary:", error)
    }
  }, [error])

  return (
    <div>
      <ErrorPage code={500} reset={reset} />
      <PublicFooter />
    </div>
  )
}
