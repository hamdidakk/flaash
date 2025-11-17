"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import { useSessionStore } from "@/store/session-store"
import { isDashboardUser, isChatUser } from "@/lib/user-roles"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, user } = useSessionStore()
  const reason = searchParams.get("reason")

  useEffect(() => {
    if (status === "authenticated" && user) {
      // Router selon le rôle après login
      if (isDashboardUser(user)) {
        router.replace("/home")
      } else if (isChatUser(user)) {
        // Rediriger vers le chatbot ou la page d'accueil publique
        router.replace("/chat")
      } else {
        // Utilisateur sans rôle valide, rediriger vers la page d'accueil
        router.replace("/")
      }
    }
  }, [status, user, router])

  return (
    <AuthLayout>
      <AuthCard
        title={t("auth.login")}
        description={t("auth.loginDescription")}
        footer={
          <>
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="text-primary hover:underline">
              {t("auth.signup")}
            </Link>
          </>
        }
      >
        {reason === "session-expired" && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {t("auth.sessionExpired")}
          </div>
        )}
        {reason === "access-denied" && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {t("auth.accessDenied")}
          </div>
        )}
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  )
}
