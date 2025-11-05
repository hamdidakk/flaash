"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export default function AdminEntryPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home")
    }
  }, [user, isLoading, router])

  if (user) return null

  return (
    <AuthLayout>
      <AuthCard title={t("auth.login")} description={t("auth.loginDescription")}>
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  )
}


