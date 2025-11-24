"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { useLanguage } from "@/lib/language-context"
import { useSessionStore } from "@/store/session-store"
import { useEffect, useRef } from "react"

interface RagLoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RagLoginModal({ open, onOpenChange }: RagLoginModalProps) {
  const { t } = useLanguage()
  const { status, user } = useSessionStore()
  const previousStatusRef = useRef<"idle" | "loading" | "authenticated" | "unauthenticated">(status)

  // Détecter quand l'utilisateur passe de "unauthenticated" ou "loading" à "authenticated"
  // Cela signifie qu'une connexion vient de réussir
  useEffect(() => {
    const wasUnauthenticated = previousStatusRef.current === "unauthenticated" || previousStatusRef.current === "loading"
    const isNowAuthenticated = status === "authenticated" && user !== null

    // Si la modal est ouverte et qu'on vient de passer à "authenticated", fermer la modal
    if (open && wasUnauthenticated && isNowAuthenticated) {
      // Petit délai pour permettre au formulaire de terminer
      const timeoutId = setTimeout(() => {
        onOpenChange(false)
      }, 300)
      return () => clearTimeout(timeoutId)
    }

    // Mettre à jour le statut précédent
    previousStatusRef.current = status
  }, [status, user, open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="auth-card" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="login-page__title">
            {t("auth.login")}
          </DialogTitle>
          <DialogDescription className="login-page__description">
            Accédez à votre espace FLAASH et vos outils IA.
          </DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}

