"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useSessionStore } from "@/store/session-store"
import { useLanguage } from "@/lib/language-context"
import { ErrorPage } from "@/components/error-page"
import type { ErrorCode } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"
import { RagLoginModal } from "./RagLoginModal"

type RagGuardProps = {
  children: ReactNode
}

export function RagGuard({ children }: RagGuardProps) {
  const { t } = useLanguage()
  const { user, status, error, errorCode, loadProfile, throttled, clearError } = useSessionStore()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Charger le profil au démarrage si le statut est "idle" (après un refresh)
  useEffect(() => {
    if (status === "idle") {
      void loadProfile()
    }
  }, [status, loadProfile])

  // Afficher la modal de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (status === "unauthenticated" && (!errorCode || errorCode === 401 || errorCode === 403)) {
      // Attendre un peu pour éviter d'afficher la modal trop rapidement pendant le chargement
      const timeoutId = setTimeout(() => {
        setShowLoginModal(true)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
    // Ne pas fermer automatiquement la modal quand l'utilisateur s'authentifie
    // La modal se fermera elle-même via RagLoginModal après une connexion réussie
  }, [status, errorCode])

  if (throttled) {
    return (
      <div className="rag-fullscreen">
        <div className="rag-fullscreen__panel">
          <ThrottlingAlert
            reason={error}
            onRetry={() => {
              clearError()
              loadProfile().catch(() => undefined)
            }}
          />
        </div>
      </div>
    )
  }

  if (status === "idle" || status === "loading") {
    return (
      <div className="rag-fullscreen--simple">
        <div className="text-center">
          <div className="rag-spinner" />
          <p className="rag-spinner__text">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  // Afficher le contenu même si non authentifié, mais avec la modal de connexion ouverte
  // L'utilisateur peut fermer la modal et naviguer vers d'autres pages
  return (
    <>
      {children}
      <RagLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}

