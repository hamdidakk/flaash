"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  const { t } = useLanguage()

  return (
    <AuthLayout>
      <AuthCard
        title={t("auth.signup")}
        description={t("auth.signupDescription")}
        footer={
          <>
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("auth.login")}
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthCard>
    </AuthLayout>
  )
}
