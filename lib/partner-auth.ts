"use client"

import { AppError } from "@/lib/error-handler"
import { apiFetch } from "@/lib/session-client"

export const PARTNER_CONFIG_STORAGE_KEY = "dakkom:partner-config"
export const PARTNER_TOKEN_STORAGE_KEY = "dakkom:partner-token"
const TOKEN_EXPIRY_SKEW_MS = 30_000

const PARTNER_AUTH_ENDPOINTS = {
  token: "/api/dakkom/auth/partner/token",
  refresh: "/api/dakkom/auth/partner/refresh",
} as const

type Maybe<T> = T | null | undefined

export interface PartnerAuthConfig {
  partnerId: string
  partnerSecret: string
  scopes?: string[] | string
  audience?: string
}

export interface PartnerTokenResponse {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  scope?: string
  [key: string]: unknown
}

export interface StoredPartnerToken {
  accessToken: string
  refreshToken?: string
  tokenType?: string
  scope?: string
  expiresAt?: number
}

const isBrowser = typeof window !== "undefined"
let inMemoryToken: StoredPartnerToken | null = null
let refreshPromise: Promise<StoredPartnerToken | null> | null = null

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const normalizeScopes = (scopes?: string[] | string): string | undefined => {
  if (!scopes) return undefined
  if (Array.isArray(scopes)) {
    return scopes
      .map((scope) => scope.trim())
      .filter(Boolean)
      .join(" ")
  }
  return scopes
    .split(/[,\s]+/g)
    .map((scope) => scope.trim())
    .filter(Boolean)
    .join(" ")
}

export function getStoredPartnerConfig(): PartnerAuthConfig | null {
  if (!isBrowser) return null
  return safeParse<PartnerAuthConfig>(window.localStorage.getItem(PARTNER_CONFIG_STORAGE_KEY))
}

export function setStoredPartnerConfig(config: PartnerAuthConfig) {
  if (!isBrowser) return
  window.localStorage.setItem(PARTNER_CONFIG_STORAGE_KEY, JSON.stringify(config))
}

export function clearStoredPartnerConfig() {
  if (!isBrowser) return
  window.localStorage.removeItem(PARTNER_CONFIG_STORAGE_KEY)
}

export function getStoredPartnerToken(): StoredPartnerToken | null {
  if (inMemoryToken) return inMemoryToken
  if (!isBrowser) return null
  const parsed = safeParse<StoredPartnerToken>(window.localStorage.getItem(PARTNER_TOKEN_STORAGE_KEY))
  inMemoryToken = parsed
  return parsed
}

export function setStoredPartnerToken(token: StoredPartnerToken | null) {
  inMemoryToken = token
  if (!isBrowser) return
  if (!token) {
    window.localStorage.removeItem(PARTNER_TOKEN_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(PARTNER_TOKEN_STORAGE_KEY, JSON.stringify(token))
}

export function clearStoredPartnerToken() {
  setStoredPartnerToken(null)
}

const toStoredToken = (payload: PartnerTokenResponse): StoredPartnerToken => {
  const expiresAt = typeof payload.expires_in === "number" ? Date.now() + payload.expires_in * 1000 : undefined
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    tokenType: payload.token_type ?? "Bearer",
    scope: payload.scope,
    expiresAt,
  }
}

const isTokenExpired = (token?: StoredPartnerToken | null) => {
  if (!token?.accessToken) return true
  if (!token.expiresAt) return false
  return token.expiresAt - Date.now() <= TOKEN_EXPIRY_SKEW_MS
}

const resolvePartnerPayload = (config: PartnerAuthConfig) => ({
  partner_id: config.partnerId,
  partner_secret: config.partnerSecret,
  scope: normalizeScopes(config.scopes),
  audience: config.audience,
})

export async function requestPartnerToken(config: PartnerAuthConfig): Promise<StoredPartnerToken> {
  const body = resolvePartnerPayload(config)
  const { data } = await apiFetch<PartnerTokenResponse>(PARTNER_AUTH_ENDPOINTS.token, {
    method: "POST",
    body: JSON.stringify(body),
  })
  if (!data?.access_token) {
    throw new AppError(500, "Partner token response is invalid", data)
  }
  const stored = toStoredToken(data)
  setStoredPartnerToken(stored)
  return stored
}

export async function refreshPartnerToken(config?: PartnerAuthConfig): Promise<StoredPartnerToken> {
  const token = getStoredPartnerToken()
  if (!token?.refreshToken) {
    throw new AppError(401, "Missing refresh token for partner auth")
  }
  const payload = {
    refresh_token: token.refreshToken,
    ...(config ? { partner_id: config.partnerId } : {}),
  }
  const { data } = await apiFetch<PartnerTokenResponse>(PARTNER_AUTH_ENDPOINTS.refresh, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!data?.access_token) {
    throw new AppError(500, "Partner refresh response is invalid", data)
  }
  const stored = toStoredToken({
    refresh_token: data.refresh_token ?? token.refreshToken,
    token_type: data.token_type ?? token.tokenType,
    scope: data.scope ?? token.scope,
    expires_in: data.expires_in,
    access_token: data.access_token,
  })
  setStoredPartnerToken(stored)
  return stored
}

const ensureFreshToken = async (config?: PartnerAuthConfig): Promise<StoredPartnerToken | null> => {
  const existing = getStoredPartnerToken()
  if (existing && !isTokenExpired(existing)) {
    return existing
  }

  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      if (existing?.refreshToken) {
        return await refreshPartnerToken(config)
      }
      if (config) {
        return await requestPartnerToken(config)
      }
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

const resolveEndpoint = (endpoint: string) => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint
  }
  if (endpoint.startsWith("/api/")) {
    return endpoint
  }
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `/api/dakkom${normalized}`
}

export async function partnerFetch<T>(endpoint: string, init?: RequestInit & { json?: boolean }, config?: PartnerAuthConfig) {
  const token = await ensureFreshToken(config)
  if (!token) {
    throw new AppError(401, "No partner token available")
  }
  const headers = new Headers(init?.headers ?? {})
  headers.set("Authorization", `${token.tokenType ?? "Bearer"} ${token.accessToken}`)
  const target = resolveEndpoint(endpoint)
  try {
    return await apiFetch<T>(target, {
      ...init,
      headers,
    })
  } catch (error) {
    if (error instanceof AppError && error.throttled) {
      throw new AppError(error.code, error.message, { endpoint, ...error.details }, true)
    }
    throw error
  }
}

export async function ensurePartnerToken(config?: PartnerAuthConfig) {
  const token = await ensureFreshToken(config)
  if (!token) {
    throw new AppError(401, "Unable to resolve partner token")
  }
  return token
}


