"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useErrorHandler } from "@/lib/use-error-handler"
import { Button } from "@/components/ui/button"
import { FormField } from "./form-field"
import Link from "next/link"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithCredentials } = useAuth()
  const { t } = useLanguage()
  const { showError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await loginWithCredentials(username, password)
    } catch (error) {
      console.error("[v0] Login error:", error)
      showError(error)
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
    </form>
  )
}
