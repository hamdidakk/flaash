"use client"

import { useEffect } from "react"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { AppError } from "@/lib/error-handler"
import { useLanguage } from "@/lib/language-context"

/**
 * Composant pour intercepter les erreurs globales non gérées
 * et les afficher via des toasts
 */
export function GlobalErrorHandler() {
  const { handleError } = useErrorHandler()
  const { t } = useLanguage()

  useEffect(() => {
    // Intercepter les erreurs non gérées dans les promesses
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      const error = event.reason
      
      // Si c'est déjà une AppError, l'utiliser directement
      if (error instanceof AppError) {
        handleError(error)
        return
      }
      
      // Sinon, créer une AppError à partir de l'erreur
      if (error instanceof Error) {
        // Vérifier si c'est une erreur d'authentification et traduire
        let errorMessage = error.message
        if (error.message.includes("credentials") || error.message.includes("Authentication")) {
          if (error.message.includes("credentials were not provided")) {
            errorMessage = t("auth.credentialsNotProvided")
          } else if (error.message.includes("Authentication required") || error.message.includes("authentication")) {
            errorMessage = t("auth.authenticationRequired")
          }
          handleError(new AppError(401, errorMessage, error))
        } else {
          handleError(error)
        }
      } else {
        handleError(new AppError(500, String(error), error))
      }
    }

    // Intercepter les erreurs JavaScript non gérées
    const handleErrorEvent = (event: ErrorEvent) => {
      event.preventDefault()
      const error = event.error
      
      // Ignorer les erreurs de script externes (ex: extensions de navigateur)
      if (event.filename && !event.filename.includes(window.location.origin)) {
        return
      }
      
      if (error instanceof AppError) {
        handleError(error)
      } else if (error instanceof Error) {
        handleError(error)
      } else {
        handleError(new AppError(500, event.message || "Erreur inconnue", error))
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleErrorEvent)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleErrorEvent)
    }
  }, [handleError, t])

  return null
}

