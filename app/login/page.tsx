"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import { useSessionStore } from "@/store/session-store"
import { isDashboardUser, isChatUser } from "@/lib/user-roles"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, user, loadProfile } = useSessionStore()
  const reason = searchParams.get("reason")

  // Charger le profil au démarrage si le statut est "idle" (après un refresh)
  useEffect(() => {
    if (status === "idle") {
      void loadProfile()
    }
  }, [status, loadProfile])

  useEffect(() => {
    if (status === "authenticated" && user) {
      // Vérifier s'il y a une URL de redirection demandée
      const redirectUrl = searchParams.get("redirect")
      
      if (redirectUrl) {
        // Vérifier que l'utilisateur a accès à cette URL
        const isDashboardRoute = redirectUrl.startsWith("/home") || 
                                 redirectUrl.startsWith("/security") || 
                                 redirectUrl.startsWith("/settings") ||
                                 redirectUrl.startsWith("/documents") ||
                                 redirectUrl.startsWith("/users") ||
                                 redirectUrl.startsWith("/analytics")
        
        if (isDashboardRoute && !isDashboardUser(user)) {
          // L'utilisateur n'a pas accès, rediriger selon son rôle
          if (isChatUser(user)) {
            router.replace("/chat")
          } else {
            router.replace("/")
          }
        } else {
          // Rediriger vers l'URL demandée
          router.replace(redirectUrl)
        }
      } else {
        // Pas d'URL de redirection, router selon le rôle
        if (isDashboardUser(user)) {
          router.replace("/home")
        } else if (isChatUser(user)) {
          router.replace("/chat")
        } else {
          router.replace("/")
        }
      }
    }
  }, [status, user, router, searchParams])

  return (
    <main id="main">
      <PublicHeader />
      <section className="min-h-[calc(100vh-var(--public-header-height,4rem)-var(--public-footer-height,auto))] bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          {/* Contenu descriptif */}
          <div className="mb-8 text-center md:mb-12">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t("auth.login")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t("auth.loginDescription")}
            </p>
          </div>

          {/* Formulaire de connexion centré */}
          <div className="flex justify-center">
            <AuthCard
              title=""
              description=""
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
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {t("auth.sessionExpired")}
                </div>
              )}
              {reason === "access-denied" && (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {t("auth.accessDenied")}
                </div>
              )}
              <LoginForm />
            </AuthCard>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <Link href="/reset-password" className="text-primary hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  )
}
