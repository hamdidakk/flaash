"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useSessionStore } from "@/store/session-store"
import { useLanguage } from "@/lib/language-context"
import { ErrorPage } from "@/components/error-page"
import type { ErrorCode } from "@/lib/error-handler"
import { useRouter } from "next/navigation"
import { isDashboardUser } from "@/lib/user-roles"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

type DashboardGuardProps = {
  children: ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { user, status, error, errorCode, loadProfile, throttled, clearError } = useSessionStore()

  // Charger le profil au démarrage si le statut est "idle" (après un refresh)
  useEffect(() => {
    if (status === "idle") {
      void loadProfile()
    }
  }, [status, loadProfile])

  // Rediriger vers /login seulement si on est vraiment non authentifié (pas en cours de chargement)
  useEffect(() => {
    // Ne rediriger que si on est vraiment non authentifié ET que le chargement est terminé
    if (status === "unauthenticated" && (!errorCode || errorCode === 401 || errorCode === 403)) {
      // Attendre un peu pour éviter les redirections trop rapides pendant le chargement
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams()
        if (errorCode === 401) {
          params.set("reason", "session-expired")
        } else if (errorCode === 403) {
          params.set("reason", "access-denied")
        }
        // Stocker l'URL demandée pour redirection après login
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname
          if (currentPath !== "/login") {
            params.set("redirect", currentPath)
          }
        }
        const target = params.toString() ? `/login?${params.toString()}` : "/login"
        router.replace(target)
      }, 100) // Petit délai pour éviter les redirections trop rapides

      return () => clearTimeout(timeoutId)
    }
  }, [status, errorCode, router])

  if (throttled) {
    return (
      <div className="dashboard-fullscreen">
        <div className="dashboard-fullscreen__panel">
          <ThrottlingAlert
            reason={error}
            onRetry={() => {
              clearError()
              loadProfile().catch(() => undefined)
            }}
          />
        </div>
      </div>
    )
  }

  if (status === "idle" || status === "loading") {
    return (
      <div className="dashboard-fullscreen--simple">
        <div className="text-center">
          <div className="dashboard-spinner" />
          <p className="dashboard-spinner__text">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" && (!errorCode || errorCode === 401 || errorCode === 403)) {
    return (
      <div className="dashboard-fullscreen--simple">
        <div className="text-center">
          <div className="dashboard-spinner" />
          <p className="dashboard-spinner__text">
            {t("auth.redirectingToLogin") || t("common.loading")}
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || errorCode) {
    const code: ErrorCode | "generic" = errorCode ?? 401
    return (
      <div className="dashboard-fullscreen">
        <div className="dashboard-fullscreen__panel">
          <ErrorPage code={code} />
          {error && <p className="dashboard-spinner__text">{error}</p>}
        </div>
      </div>
    )
  }

  if (error && status !== "authenticated") {
    return (
      <div className="dashboard-fullscreen">
        <div className="dashboard-fullscreen__panel">
          <ErrorPage code="generic" />
          <p className="dashboard-spinner__text">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Vérifier que l'utilisateur a accès au dashboard
  if (!isDashboardUser(user)) {
    return (
      <div className="dashboard-fullscreen">
        <div className="dashboard-fullscreen__panel">
          <ErrorPage code={403} />
          <p className="dashboard-spinner__text">
            {t("auth.accessDenied")}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

