"use client"

import { useEffect } from "react"
import { ErrorPage } from "@/components/error-page"
import { LanguageProvider } from "@/lib/language-context"
import { PublicFooter } from "@/components/public/PublicFooter"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error caught:", error)
  }, [error])

      return (
        <html lang="fr">
          <body>
            <LanguageProvider>
              <div>
                <ErrorPage code={500} reset={reset} />
                <PublicFooter />
              </div>
            </LanguageProvider>
          </body>
        </html>
      )
}
