"use client"

import type React from "react"

import { useEffect } from "react"
import { useSessionStore } from "@/store/session-store"
import { ErrorPage } from "@/components/error-page"
import type { ErrorCode } from "@/lib/error-handler"
import { useLanguage } from "@/lib/language-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user" | "viewer"
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
    const roleHierarchy = { admin: 3, user: 2, viewer: 1 }
    const userLevel = user.is_staff ? 3 : roleHierarchy.viewer
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      return null
    }
  }

  return <>{children}</>
}
