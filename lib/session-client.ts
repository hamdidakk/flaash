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
      const contentType = response.headers.get("Content-Type") ?? ""
      const isJson = contentType.includes("application/json")
      
      let errorMessage = response.statusText || "Session request failed"
      
      try {
        // Lire le body une seule fois
        const raw = await response.text().catch(() => "")
        
        if (raw) {
          if (isJson) {
            // Essayer de parser comme JSON
            try {
              const json = JSON.parse(raw)
              // Extraire le message d'erreur depuis différents formats possibles
              errorMessage = 
                json.detail || 
                json.error || 
                json.message || 
                (typeof json === "string" ? json : JSON.stringify(json)) ||
                errorMessage
            } catch {
              // Si le JSON est invalide, utiliser le texte brut
              errorMessage = raw
            }
          } else {
            // Essayer de parser comme JSON même si Content-Type n'est pas JSON
            // (certains backends retournent du JSON sans le bon Content-Type)
            try {
              const parsed = JSON.parse(raw)
              errorMessage = parsed.detail || parsed.error || parsed.message || raw
            } catch {
              // Si ce n'est pas du JSON, utiliser le texte brut
              errorMessage = raw
            }
          }
        }
      } catch (parseError) {
        // Si le parsing échoue, utiliser le message par défaut
        console.warn("[session-client] Failed to parse error response:", parseError)
      }
      
      const code = isErrorCode(response.status) ? response.status : 500
      
      // Pour les erreurs 401, créer une erreur silencieuse qui ne sera pas loggée
      // Les erreurs 401 sont normales après déconnexion ou si l'utilisateur n'est pas connecté
      if (code === 401) {
        // Créer une erreur avec un flag spécial pour indiquer qu'elle ne doit pas être loggée
        const silentError = new AppError(
          code,
          errorMessage,
          {
            url: typeof input === "string" ? input : input.toString(),
            status: response.status,
            silent: true, // Flag pour indiquer que cette erreur ne doit pas être loggée
          },
          false,
        )
        // Ajouter une propriété pour empêcher le logging
        ;(silentError as any).__silent = true
        throw silentError
      }
      
      // Pour les autres erreurs, logger uniquement les erreurs serveur (500+)
      if (code >= 500) {
        console.error(`[session-client] Server error ${code} from ${typeof input === "string" ? input : input.toString()}:`, errorMessage)
      }
      
      throw new AppError(
        code,
        errorMessage,
        {
          url: typeof input === "string" ? input : input.toString(),
          status: response.status,
        },
        response.status === 429,
      )
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
      // Ne pas logger les erreurs 401 en production (c'est normal après déconnexion)
      if (error.code === 401 && process.env.NODE_ENV === "production") {
        // Erreur 401 silencieuse en production
      }
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
    // Les erreurs 401 (non authentifié) sont normales et ne doivent pas être propagées comme erreurs
    // Cela peut arriver après une déconnexion ou si l'utilisateur n'est pas connecté
    if (error instanceof AppError && error.code === 401) {
      return null
    }
    // Pour les autres erreurs, on les propage
    throw error
  }
}

export async function sessionLogout() {
  return sessionFetch<void>(SESSION_ENDPOINTS.logout, { method: "POST", redirect: "follow" })
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit) {
  // Pour les appels API non-session, on permet les redirections normales
  // et on ne les traite pas comme des erreurs de session
  const url = typeof input === "string" ? input : input.toString()
  const isSessionEndpoint = url.includes("/api/session/")
  
  return sessionFetch<T>(input, {
    ...init,
    redirect: isSessionEndpoint ? (init?.redirect ?? "manual") : "follow",
  })
}

