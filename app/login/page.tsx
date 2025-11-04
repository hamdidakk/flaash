"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const { t } = useLanguage()

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
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  )
}
