"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AppError } from "./error-handler"
import {
  setStoredApiBaseUrl,
  setStoredApiKey,
  getStoredApiBaseUrl,
  getStoredApiKey,
  listDocumentNames,
  setStoredTokens,
  clearStoredTokens,
  getStoredRefreshToken,
  getStoredAccessToken,
} from "@/lib/dakkom-api"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "viewer"
  organizationId: string
  organizationName: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithApiConfig: (baseUrl: string, apiKey: string) => Promise<void>
  loginWithCredentials: (username: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("[v0] Failed to parse stored user:", error)
          localStorage.removeItem("user")
        }
      }
    }
    setIsLoading(false)
  }, [])

  // Auto-login if env/local storage provides API config and no user yet (dashboard pages only)
  useEffect(() => {
    if (user) return
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      // Skip auto-login on all public pages
      const isPublic = ["/", "/chat", "/widget", "/about", "/guide", "/abonnement", "/privacy", "/legal"].includes(path)
      if (path.startsWith("/admin") || isPublic) return
    }
    const autoFlag = process.env.NEXT_PUBLIC_ENABLE_LOGIN
    // If login UI is disabled (default), try auto-login
    const shouldAuto = !autoFlag || autoFlag.toLowerCase() !== "true"
    const base = getStoredApiBaseUrl()
    const key = getStoredApiKey()
    if (shouldAuto && base && key) {
      // fire and forget
      void loginWithApiConfig(base, key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loginWithApiConfig = async (baseUrl: string, apiKey: string) => {
    if (!baseUrl || !apiKey) {
      throw new AppError(400, "API base URL and API key are required")
    }

    // Persist API config
    setStoredApiBaseUrl(baseUrl.trim())
    setStoredApiKey(apiKey.trim())

    // Validate by hitting an authenticated endpoint
    try {
      await listDocumentNames()
    } catch (e) {
      throw new AppError(401, "Invalid API configuration or key", { error: String(e) })
    }

    const email = "api@local"
    const mockUser: User = {
      id: "api-user",
      email,
      name: "API User",
      role: "admin",
      organizationId: "default",
      organizationName: getStoredApiBaseUrl() || "API",
    }

    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path === "/login" || path === "/signup" || path === "/admin") {
        router.push("/home")
      }
    }
  }

  const loginWithCredentials = async (username: string, password: string) => {
    if (!username || !password) {
      throw new AppError(400, "Username and password are required")
    }
    const base = getStoredApiBaseUrl()
    if (!base) throw new AppError(400, "API base URL missing")
    const resp = await fetch(`/api/dakkom/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!resp.ok) {
      const text = await resp.text()
      throw new AppError(401, text || "Login failed")
    }
    const data = (await resp.json()) as { access: string; refresh: string }
    setStoredTokens(data.access, data.refresh)

    const mockUser: User = {
      id: "jwt-user",
      email: `${username}@local`,
      name: username,
      role: "admin",
      organizationId: "default",
      organizationName: getStoredApiBaseUrl() || "API",
    }
    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mockUser))
      const path = window.location.pathname
      if (path === "/login" || path === "/signup" || path === "/admin") {
        router.push("/home")
      }
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new AppError(400, "All fields are required")
    }

    // Mock signup
    const mockUser: User = {
      id: "1",
      email,
      name,
      role: "admin",
      organizationId: "1",
      organizationName: "New Organization",
    }

    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
    router.push("/onboarding")
  }

  const logout = async () => {
    try {
      const refresh = getStoredRefreshToken()
      if (refresh) {
        await fetch(`/api/dakkom/auth/logout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getStoredAccessToken()}` },
          body: JSON.stringify({ refresh }),
        })
      }
    } catch {}
    clearStoredTokens()
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/admin")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithApiConfig, loginWithCredentials, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
