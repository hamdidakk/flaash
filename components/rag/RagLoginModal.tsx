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
  const wasUnauthenticatedWhenOpenedRef = useRef(false)

  // Mémoriser si l'utilisateur était non authentifié quand la modal s'est ouverte
  useEffect(() => {
    if (open && status === "unauthenticated") {
      wasUnauthenticatedWhenOpenedRef.current = true
    }
  }, [open, status])

  // Fermer la modal automatiquement seulement si l'utilisateur vient de se connecter avec succès
  // (c'est-à-dire qu'il était non authentifié quand la modal s'est ouverte)
  useEffect(() => {
    if (
      status === "authenticated" &&
      user &&
      open &&
      wasUnauthenticatedWhenOpenedRef.current
    ) {
      // Petit délai pour permettre au formulaire de terminer et éviter tout reload
      const timeoutId = setTimeout(() => {
        onOpenChange(false)
        wasUnauthenticatedWhenOpenedRef.current = false
      }, 200)
      return () => clearTimeout(timeoutId)
    }
  }, [status, user, open, onOpenChange])

  // Réinitialiser le flag quand la modal se ferme
  useEffect(() => {
    if (!open) {
      wasUnauthenticatedWhenOpenedRef.current = false
    }
  }, [open])

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

