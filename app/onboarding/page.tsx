"use client"

import { useLanguage } from "@/lib/language-context"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingForm } from "@/components/auth/onboarding-form"

export default function OnboardingPage() {
  const { t } = useLanguage()

  return (
    <AuthLayout>
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("onboarding.title")}</CardTitle>
          <CardDescription>{t("onboarding.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
