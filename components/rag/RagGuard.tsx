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
  // Ne pas charger si on vient de se déconnecter (status serait "unauthenticated")
  // Ne pas charger si l'utilisateur est déjà présent (déjà connecté)
  useEffect(() => {
    if (status === "idle" && !user) {
      void loadProfile().catch(() => {
        // Ignorer silencieusement les erreurs de chargement de profil
        // (l'utilisateur peut ne pas être connecté)
      })
    } else if (user && status === "idle") {
      // Si l'utilisateur existe déjà, mettre le statut à "authenticated"
      // Cela peut arriver si le store a été initialisé avec un utilisateur depuis un autre composant
      // Mais normalement, si user existe, le statut devrait déjà être "authenticated"
    }
  }, [status, loadProfile, user])

  // Afficher la modal de connexion si l'utilisateur n'est pas authentifié
  // Mais seulement si on n'est pas en train de charger le profil
  useEffect(() => {
    // PRIORITÉ 1: Si l'utilisateur existe et est authentifié, fermer la modal
    if (user && status === "authenticated") {
      setShowLoginModal(false)
      return
    }

    // PRIORITÉ 2: Si on est en train de charger, ne pas afficher la modal
    // (attendre que le chargement soit terminé)
    if (status === "idle" || status === "loading") {
      setShowLoginModal(false)
      return
    }

    // PRIORITÉ 3: Si l'utilisateur existe mais le statut n'est pas encore "authenticated"
    // (peut arriver pendant une transition), ne pas afficher la modal
    if (user) {
      setShowLoginModal(false)
      return
    }

    // PRIORITÉ 4: Afficher la modal seulement si :
    // - Le statut est "unauthenticated" (pas en cours de chargement)
    // - L'utilisateur n'existe pas
    // - Le chargement est terminé (pas "idle" ni "loading")
    if (status === "unauthenticated" && !user && (!errorCode || errorCode === 401 || errorCode === 403)) {
      // Attendre un peu pour éviter d'afficher la modal trop rapidement pendant le chargement
      const timeoutId = setTimeout(() => {
        setShowLoginModal(true)
      }, 100)

      return () => clearTimeout(timeoutId)
    } else {
      // Si on n'est pas dans les conditions pour afficher la modal, la fermer
      setShowLoginModal(false)
    }
  }, [status, user, errorCode])

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

