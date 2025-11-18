"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  const { t } = useLanguage()

  return (
    <main id="main">
      <PublicHeader />
      <section className="min-h-[calc(100vh-var(--public-header-height,4rem)-var(--public-footer-height,auto))] bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          {/* Contenu descriptif */}
          <div className="mb-8 text-center md:mb-12">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t("auth.signup")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t("auth.signupDescription")}
            </p>
          </div>

          {/* Formulaire d'inscription centré */}
          <div className="flex justify-center">
            <AuthCard
              title=""
              description=""
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
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  )
}
