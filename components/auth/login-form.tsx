"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useErrorHandler } from "@/lib/use-error-handler"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import { useSessionStore } from "@/store/session-store"
import { AppError } from "@/lib/error-handler"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const login = useSessionStore((state) => state.login)
  const { t } = useLanguage()
  const { showError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)
    try {
      await login({ username, password })
    } catch (error) {
      if (error instanceof AppError && error.code === 401) {
        setFormError(t("auth.invalidCredentials") || "Identifiants ou mot de passe incorrect.")
      } else {
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("common.loading") : t("auth.login")}
      </Button>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
    </form>
  )
}
