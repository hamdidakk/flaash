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

  useEffect(() => {
    if (status === "idle") {
      void loadProfile()
    }
  }, [status, loadProfile])

  useEffect(() => {
    if (status === "unauthenticated" && (!errorCode || errorCode === 401 || errorCode === 403)) {
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
    }
  }, [status, errorCode, router])

  if (throttled) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
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
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" && (!errorCode || errorCode === 401 || errorCode === 403)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            {t("auth.redirectingToLogin") || t("common.loading")}
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || errorCode) {
    const code: ErrorCode | "generic" = errorCode ?? 401
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <ErrorPage code={code} />
          {error && <p className="mt-4 text-center text-sm text-muted-foreground">{error}</p>}
        </div>
      </div>
    )
  }

  if (error && status !== "authenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <ErrorPage code="generic" />
          <p className="mt-4 text-center text-sm text-muted-foreground">{error}</p>
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
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <ErrorPage code={403} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.accessDenied")}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

