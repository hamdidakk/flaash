"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user" | "viewer"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not authenticated - redirect to 401 error
        router.push("/error/401")
      } else if (requiredRole) {
        // Check role permissions
        const roleHierarchy = { admin: 3, user: 2, viewer: 1 }
        const userLevel = roleHierarchy[user.role]
        const requiredLevel = roleHierarchy[requiredRole]

        if (userLevel < requiredLevel) {
          // User doesn't have required permissions - redirect to 403 error
          router.push("/error/403")
        }
      }
    }
  }, [user, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole) {
    const roleHierarchy = { admin: 3, user: 2, viewer: 1 }
    const userLevel = roleHierarchy[user.role]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      return null
    }
  }

  return <>{children}</>
}
