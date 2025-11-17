"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useErrorHandler } from "@/lib/use-error-handler"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import { useSessionStore } from "@/store/session-store"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useSessionStore((state) => state.setUser)
  const { t } = useLanguage()
  const { showError } = useErrorHandler()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Le backend assignera le rôle approprié lors de l'inscription
      // On définit ici une valeur par défaut pour la compatibilité
      setUser({
        id: 0, // Sera remplacé par le backend
        email,
        name,
        is_staff: false,
        role: "member", // Rôle par défaut pour les nouveaux utilisateurs
      })
      router.push("/onboarding")
    } catch (error) {
      console.error("[v0] Signup error:", error)
      showError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label={t("auth.name")}
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={setName}
        required
        disabled={isLoading}
      />
      <FormField
        id="email"
        label={t("auth.email")}
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={setEmail}
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
        minLength={6}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("common.loading") : t("auth.signup")}
      </Button>
    </form>
  )
}
