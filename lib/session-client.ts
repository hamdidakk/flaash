"use client"

import { AppError, isErrorCode } from "@/lib/error-handler"
import type { User } from "@/lib/user-roles"

type SessionUser = User

type LoginPayload = {
  username: string
  password: string
}

type SessionResponse<T = unknown> = {
  data: T | null
  status: number
}

const SESSION_ENDPOINTS = {
  login: "/api/session/login",
  profile: "/api/session/profile",
  logout: "/api/session/logout",
} as const

const CSRF_COOKIE_NAME = "csrftoken"

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

const isFormData = (body: BodyInit | null | undefined): body is FormData =>
  typeof FormData !== "undefined" && body instanceof FormData

const buildHeaders = (initHeaders?: HeadersInit, body?: BodyInit | null) => {
  const headers = new Headers(initHeaders ?? {})
  const csrfToken = getCookie(CSRF_COOKIE_NAME)
  if (csrfToken) {
    headers.set("X-CSRFToken", csrfToken)
  }
  if (body && !isFormData(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  return headers
}

async function sessionFetch<T>(input: RequestInfo | URL, init?: RequestInit & { json?: boolean }): Promise<SessionResponse<T>> {
  const headers = buildHeaders(init?.headers, init?.body)

  try {
    const redirectMode = init?.redirect ?? "manual"
    const response = await fetch(input, {
      ...init,
      headers,
      credentials: "include",
      redirect: redirectMode,
    })

    if (
      redirectMode === "manual" &&
      (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400))
    ) {
      throw new AppError(401, "Session redirect detected", {
        url: typeof input === "string" ? input : input.toString(),
        status: response.status,
        redirected: true,
      })
    }

    if (!response.ok) {
      const raw = await response.text().catch(() => "")
      const code = isErrorCode(response.status) ? response.status : 500
      throw new AppError(code, raw || response.statusText || "Session request failed", {
        url: typeof input === "string" ? input : input.toString(),
        status: response.status,
      })
    }

    if (response.status === 204) {
      return { status: response.status, data: null }
    }

    const contentType = response.headers.get("Content-Type") ?? ""
    const isJson = contentType.includes("application/json")
    const data = isJson ? ((await response.json()) as T) : (null as T | null)
    return { status: response.status, data }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(503, error instanceof Error ? error.message : "Failed to fetch session", error)
  }
}

export async function sessionLogin(payload: LoginPayload) {
  return sessionFetch<SessionUser>(SESSION_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(payload),
    redirect: "follow",
  })
}

export async function sessionProfile() {
  try {
    const res = await sessionFetch<SessionUser>(SESSION_ENDPOINTS.profile, { method: "GET" })
    return res.data
  } catch (error: any) {
    if (error instanceof AppError && error.code === 401) {
      return null
    }
    throw error
  }
}

export async function sessionLogout() {
  return sessionFetch<void>(SESSION_ENDPOINTS.logout, { method: "POST", redirect: "follow" })
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit) {
  return sessionFetch<T>(input, init)
}

