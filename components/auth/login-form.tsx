"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useErrorHandler } from "@/lib/use-error-handler"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import { useSessionStore } from "@/store/session-store"
import { AppError } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const login = useSessionStore((state) => state.login)
  const throttled = useSessionStore((state) => state.throttled)
  const storeError = useSessionStore((state) => state.error)
  const clearSessionError = useSessionStore((state) => state.clearError)
  const { t } = useLanguage()
  const { showError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)
    try {
      await login({ username, password })
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === 401) {
          setFormError(t("auth.invalidCredentials") || "Identifiants ou mot de passe incorrect.")
        } else if (error.code >= 500) {
          // Erreur serveur (500, 503, etc.)
          setFormError(
            t("errors.500.description") || 
            "Une erreur serveur s'est produite. Veuillez réessayer dans quelques instants. Si le problème persiste, contactez le support."
          )
          // Afficher aussi un toast pour plus de détails
          showError(error)
        } else {
          // Autres erreurs (400, 403, etc.)
          setFormError(error.message || t("common.error") || "Une erreur s'est produite.")
          showError(error)
        }
      } else {
        // Erreur inconnue
        setFormError(t("common.error") || "Une erreur inattendue s'est produite.")
        showError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="username"
        label={t("auth.username")}
        type="text"
        value={username}
        onChange={setUsername}
        required
        disabled={isLoading}
      />
      <FormField
        id="password"
        label={t("auth.password")}
        type="password"
        value={password}
        onChange={setPassword}
        required
        disabled={isLoading}
      />
      {throttled && <ThrottlingAlert reason={storeError || t("throttling.description")} onRetry={clearSessionError} />}
      <Button type="submit" className="w-full" disabled={isLoading || throttled}>
        {isLoading ? t("common.loading") : t("auth.login")}
      </Button>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
    </form>
  )
}
