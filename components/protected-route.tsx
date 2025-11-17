"use client"

import type React from "react"

import { useEffect } from "react"
import { useSessionStore } from "@/store/session-store"
import { ErrorPage } from "@/components/error-page"
import type { ErrorCode } from "@/lib/error-handler"
import { useLanguage } from "@/lib/language-context"
import { isDashboardUser, type UserRole } from "@/lib/user-roles"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | "admin" | "user" | "viewer" // Garde la compatibilité avec l'ancien système
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, status, errorCode, error, loadProfile } = useSessionStore()
  const { t } = useLanguage()

  useEffect(() => {
    if (status === "idle") {
      void loadProfile()
    }
  }, [status, loadProfile])

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (status === "unauthenticated" || errorCode) {
    const code: ErrorCode | "generic" = errorCode ?? 401
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <ErrorPage code={code} />
          {error && <p className="mt-4 text-center text-sm text-muted-foreground">{error}</p>}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              onClick={() => {
                void loadProfile()
              }}
            >
              {t("common.retry")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole) {
    // Support pour les nouveaux rôles
    if (["admin", "manager", "agent", "member"].includes(requiredRole)) {
      const roleHierarchy: Record<UserRole, number> = { admin: 4, manager: 3, agent: 2, member: 1 }
      const userLevel = roleHierarchy[user.role] || 0
      const requiredLevel = roleHierarchy[requiredRole as UserRole] || 0

      if (userLevel < requiredLevel) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-lg">
              <ErrorPage code={403} />
              <p className="mt-4 text-center text-sm text-muted-foreground">{t("auth.accessDenied")}</p>
            </div>
          </div>
        )
      }
    } else {
      // Support pour l'ancien système (rétrocompatibilité)
      const roleHierarchy = { admin: 3, user: 2, viewer: 1 }
      const userLevel = isDashboardUser(user) ? 3 : roleHierarchy.viewer
      const requiredLevel = roleHierarchy[requiredRole as "admin" | "user" | "viewer"] || 0

      if (userLevel < requiredLevel) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-lg">
              <ErrorPage code={403} />
              <p className="mt-4 text-center text-sm text-muted-foreground">{t("auth.accessDenied")}</p>
            </div>
          </div>
        )
      }
    }
  }

  return <>{children}</>
}
