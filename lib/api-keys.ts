import { apiFetch } from "@/lib/session-client"
import { AppError } from "@/lib/error-handler"

const withTrailingSlash = (value: string) => (value.endsWith("/") ? value : `${value}/`)

const API_KEYS_BASE = withTrailingSlash("/api/auth-api/api_key")
const API_KEY_EVENTS_BASE = withTrailingSlash("/api/auth-api/api_key/events")

type Maybe<T> = T | null | undefined

const buildQueryString = (params?: Record<string, Maybe<string | number | boolean>>) => {
  if (!params) return ""
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    search.set(key, String(value))
  })
  const query = search.toString()
  return query ? `?${query}` : ""
}

const buildApiKeyUrl = (suffix?: string) => {
  if (!suffix) return API_KEYS_BASE
  const normalized = suffix.replace(/^\/+|\/+$/g, "")
  return withTrailingSlash(`${API_KEYS_BASE}${normalized}`)
}

const buildEventsUrl = (suffix?: string) => {
  if (!suffix) return API_KEY_EVENTS_BASE
  const normalized = suffix.replace(/^\/+|\/+$/g, "")
  return withTrailingSlash(`${API_KEY_EVENTS_BASE}${normalized}`)
}

export type ApiKeyStatus = "active" | "inactive" | "revoked"

export interface ApiKeyRecord {
  id: number | string
  prefix?: string
  label?: string
  owner: string
  scope?: string | string[]
  rate_limit?: number | null
  is_active: boolean
  last_used_at?: string | null
  last_rotated_at?: string | null
  created_at?: string
  expires_at?: string | null
  status?: ApiKeyStatus
  metadata?: Record<string, unknown>
}

export interface ApiKeyListResponse {
  results: ApiKeyRecord[]
  count: number
  next?: string | null
  previous?: string | null
}

export interface CreateApiKeyPayload {
  owner: string
  scope: string  // Le backend attend une string, même si plusieurs scopes sont séparés par des virgules
  rate_limit?: number
  expires_at?: string | null
  notes?: string
}

export interface RotateApiKeyPayload {
  reason?: string
}

export interface RevokeApiKeyPayload {
  reason?: string
}

export interface ApiKeySecret {
  key: ApiKeyRecord
  plain_text?: string
  token?: string
}

export interface ApiKeyEvent {
  id: number | string
  api_key_id?: number | string
  api_key_owner?: string
  event_type: string
  created_at: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
}

export interface ApiKeyEventResponse {
  results: ApiKeyEvent[]
  count: number
  next?: string | null
  previous?: string | null
}

export interface ApiKeyListFilters {
  search?: string
  owner?: string
  scope?: string
  is_active?: boolean
  limit?: number
  offset?: number
}

export interface ApiKeyEventFilters {
  api_key_id?: string | number
  event_type?: string
  ip_address?: string
  limit?: number
  offset?: number
}

export async function listApiKeys(filters?: ApiKeyListFilters) {
  const query = buildQueryString({
    search: filters?.search,
    owner: filters?.owner,
    scope: filters?.scope,
    is_active: typeof filters?.is_active === "boolean" ? filters?.is_active : undefined,
    limit: filters?.limit,
    offset: filters?.offset,
  })
  try {
    const { data } = await apiFetch<ApiKeyListResponse>(`${buildApiKeyUrl()}${query}`, {
      method: "GET",
    })
    return data ?? { results: [], count: 0 }
  } catch (error: any) {
    // Si l'endpoint n'existe pas encore (404), retourner une liste vide
    const is404 = 
      (error?.code === 404) ||
      (error instanceof Error && (
        error.message.includes("404") || 
        error.message.includes("not found") ||
        error.message.includes("Page not found")
      ))
    
    if (is404) {
      console.warn("[api-keys] API keys endpoint not available yet (404), returning empty list")
      return { results: [], count: 0 }
    }
    // Pour les autres erreurs, propager l'erreur
    throw error
  }
}

export async function createApiKey(payload: CreateApiKeyPayload) {
  try {
    const { data } = await apiFetch<ApiKeySecret>(buildApiKeyUrl(), {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return data ?? null
  } catch (error: any) {
    // Si l'endpoint n'existe pas encore (404), propager l'erreur avec un message clair
    const is404 = 
      (error instanceof AppError && error.code === 404) ||
      (error?.code === 404) ||
      (error instanceof Error && (
        error.message.includes("404") || 
        error.message.includes("not found") ||
        error.message.includes("Page not found")
      ))
    
    if (is404) {
      // Remplacer le message HTML par un message clair
      throw new AppError(404, "Endpoint non disponible (404). L'endpoint des clés API n'est pas encore implémenté côté backend.")
    }
    throw error
  }
}

export async function rotateApiKey(apiKeyId: string | number, payload?: RotateApiKeyPayload) {
  try {
    const { data } = await apiFetch<ApiKeySecret>(buildApiKeyUrl(`${apiKeyId}/rotate`), {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    })
    return data ?? null
  } catch (error: any) {
    const is404 = 
      (error instanceof AppError && error.code === 404) ||
      (error?.code === 404) ||
      (error instanceof Error && (
        error.message.includes("404") || 
        error.message.includes("not found") ||
        error.message.includes("Page not found")
      ))
    
    if (is404) {
      // Remplacer le message HTML par un message clair
      throw new AppError(404, "Endpoint non disponible (404). L'endpoint de rotation des clés API n'est pas encore implémenté côté backend.")
    }
    throw error
  }
}

export async function revokeApiKey(apiKeyId: string | number, payload?: RevokeApiKeyPayload) {
  try {
    const { data } = await apiFetch<ApiKeyRecord>(buildApiKeyUrl(`${apiKeyId}/revoke`), {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    })
    return data ?? null
  } catch (error: any) {
    const is404 = 
      (error instanceof AppError && error.code === 404) ||
      (error?.code === 404) ||
      (error instanceof Error && (
        error.message.includes("404") || 
        error.message.includes("not found") ||
        error.message.includes("Page not found")
      ))
    
    if (is404) {
      // Remplacer le message HTML par un message clair
      throw new AppError(404, "Endpoint non disponible (404). L'endpoint de révocation des clés API n'est pas encore implémenté côté backend.")
    }
    throw error
  }
}

export async function listApiKeyEvents(filters?: ApiKeyEventFilters) {
  const query = buildQueryString({
    api_key_id: filters?.api_key_id,
    event_type: filters?.event_type,
    ip_address: filters?.ip_address,
    limit: filters?.limit,
    offset: filters?.offset,
  })
  try {
    const { data } = await apiFetch<ApiKeyEventResponse>(`${buildEventsUrl()}${query}`, {
      method: "GET",
    })
    return data ?? { results: [], count: 0 }
  } catch (error: any) {
    // Si l'endpoint n'existe pas encore (404), retourner une liste vide
    // au lieu de faire planter l'application
    const is404 = 
      (error?.code === 404) ||
      (error instanceof Error && (
        error.message.includes("404") || 
        error.message.includes("not found") ||
        error.message.includes("Page not found")
      ))
    
    if (is404) {
      console.warn("[api-keys] Events endpoint not available yet (404), returning empty list")
      return { results: [], count: 0 }
    }
    // Pour les autres erreurs, propager l'erreur
    throw error
  }
}


