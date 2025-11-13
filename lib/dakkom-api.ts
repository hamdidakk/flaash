import { fetchWithRetry, handleError, AppError } from "@/lib/error-handler"
import { recordApiCall } from "@/lib/telemetry"

export const API_BASE_URL_STORAGE_KEY = "dakkom:api-base-url"
export const API_KEY_STORAGE_KEY = "dakkom:api-key"
export const ACCESS_TOKEN_STORAGE_KEY = "dakkom:access-token"
export const REFRESH_TOKEN_STORAGE_KEY = "dakkom:refresh-token"

// Env fallbacks (public so they are available client-side at build time)
const ENV_API_BASE_URL =
  process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  ""
const ENV_API_KEY =
  process.env.NEXT_PUBLIC_DAKKOM_API_KEY ??
  process.env.NEXT_PUBLIC_API_KEY ??
  ""

export class ApiUnavailableError extends Error {
  constructor(message = "Dakkom API is not configured") {
    super(message)
    this.name = "ApiUnavailableError"
  }
}

export interface ApiIntegrationStatus {
  baseUrl: string
  hasApiKey: boolean
  isConfigured: boolean
}

const isBrowser = typeof window !== "undefined"

export function getStoredApiBaseUrl(): string {
  if (isBrowser) {
    const stored = window.localStorage.getItem(API_BASE_URL_STORAGE_KEY)
    if (stored) return stored
  }
  return ENV_API_BASE_URL
}

export function setStoredApiBaseUrl(url: string) {
  if (!isBrowser) return
  window.localStorage.setItem(API_BASE_URL_STORAGE_KEY, url)
}

export function getStoredApiKey(): string {
  if (isBrowser) {
    const stored = window.localStorage.getItem(API_KEY_STORAGE_KEY)
    if (stored) return stored
  }
  return ENV_API_KEY
}

export function setStoredApiKey(key: string) {
  if (!isBrowser) return
  window.localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

export function clearStoredApiKey() {
  if (!isBrowser) return
  window.localStorage.removeItem(API_KEY_STORAGE_KEY)
}

export function getApiIntegrationStatus(): ApiIntegrationStatus {
  const baseUrl = getStoredApiBaseUrl()
  const apiKey = getStoredApiKey()
  return {
    baseUrl,
    hasApiKey: Boolean(apiKey),
    isConfigured: Boolean(baseUrl && apiKey),
  }
}

export function getStoredAccessToken(): string {
  if (!isBrowser) return ""
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || ""
  } catch {
    return ""
  }
}

export function getStoredRefreshToken(): string {
  if (!isBrowser) return ""
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || ""
  } catch {
    return ""
  }
}

export function setStoredTokens(access: string, refresh: string) {
  if (!isBrowser) return
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access)
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh)
}

export function clearStoredTokens() {
  if (!isBrowser) return
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

interface DakkomFetchOptions extends RequestInit {
  skipAuthCheck?: boolean
}

async function dakkomFetch<T>(endpoint: string, options: DakkomFetchOptions = {}): Promise<T> {
  const baseUrl = getStoredApiBaseUrl()
  const apiKey = getStoredApiKey()

  if (!baseUrl) {
    throw new ApiUnavailableError("Missing Dakkom API base URL")
  }

  if (!apiKey && !options.skipAuthCheck) {
    throw new ApiUnavailableError("Missing Dakkom API key")
  }

  // Use local proxy on the browser to avoid CORS; server can call upstream directly
  const useProxy = isBrowser
  const url = useProxy ? `/api/dakkom${endpoint}` : `${baseUrl.replace(/\/$/, "")}${endpoint}`

  const isFormDataBody = typeof FormData !== "undefined" && options.body instanceof FormData

  const headers: HeadersInit = {
    ...((!isFormDataBody ? { "Content-Type": "application/json" } : {}) as HeadersInit),
    ...(options.headers || {}),
    // Attach API key only for direct upstream calls (server-side). The proxy adds it otherwise.
    ...(!useProxy && apiKey && !options.skipAuthCheck ? ({ "X-API-Key": apiKey } as HeadersInit) : {}),
    ...(getStoredAccessToken() ? ({ Authorization: `Bearer ${getStoredAccessToken()}` } as HeadersInit) : {}),
  }

  const started = typeof performance !== "undefined" ? performance.now() : Date.now()
  let ok = false
  try {
    const response = await fetchWithRetry(url, {
      ...options,
      headers,
    })

    // Prefer JSON when content-type is JSON; otherwise, return an empty object
    const contentType = response.headers.get("content-type") || ""
    const text = await response.text()
    ok = response.ok
    if (!text) {
      recordApiCall(endpoint, (typeof performance !== "undefined" ? performance.now() : Date.now()) - started, 0, ok)
      return {} as T
    }
    if (contentType.includes("application/json")) {
      try {
        const parsed = JSON.parse(text) as T
        recordApiCall(endpoint, (typeof performance !== "undefined" ? performance.now() : Date.now()) - started, text.length, ok)
        return parsed
      } catch {
        // Fall through to empty object if server sent invalid JSON
        recordApiCall(endpoint, (typeof performance !== "undefined" ? performance.now() : Date.now()) - started, text.length, ok)
        return {} as T
      }
    }
    recordApiCall(endpoint, (typeof performance !== "undefined" ? performance.now() : Date.now()) - started, text.length, ok)
    return {} as T
  } catch (error) {
    recordApiCall(endpoint, (typeof performance !== "undefined" ? performance.now() : Date.now()) - started, 0, false)
    const appError = handleError(error)
    throw appError
  }
}

export interface DakkomDocumentRecord {
  id: string
  name: string
  status: string
  size?: number
  uploaded_at?: string
  meta?: Record<string, unknown>
}

export interface DakkomChunkRecord {
  chunk_id: string
  document_id: string
  content: string
  metadata?: Record<string, unknown>
}

export interface DakkomSearchResult {
  chunk_id: string
  document_id: string
  score: number
  snippet: string
  metadata?: Record<string, unknown>
}

export interface DakkomRagResponse {
  text: string
  sources: Array<{ document_id: string; chunk_id: string; snippet?: string; score?: number }>
  metadata?: Record<string, unknown>
}

export async function listDocuments() {
  return dakkomFetch<{ documents: string[] }>("/api/v1/document/list/", { method: "GET" })
}

export async function uploadDocument(payload: FormData) {
  return dakkomFetch<{ document_id: string }>("/api/v1/upload-document/", {
    method: "POST",
    body: payload,
    headers: {
      // Content-Type must be unset for FormData; fetchWithRetry will handle boundary
    },
  })
}

export async function uploadBatch(payload: FormData) {
  return dakkomFetch<{ batch_id: string }>("/api/v1/upload-batch/", {
    method: "POST",
    body: payload,
    headers: {},
  })
}

export async function removeDocument(documentId: string) {
  return dakkomFetch<{ removed: boolean }>("/api/v1/remove-document/", {
    method: "POST",
    body: JSON.stringify({ document_id: documentId }),
  })
}

export async function searchVectorStore(query: string, options?: Record<string, unknown>) {
  return dakkomFetch<{ results: DakkomSearchResult[] }>("/api/v1/search-vector-store/", {
    method: "POST",
    body: JSON.stringify({ query, ...(options ?? {}) }),
  })
}

export async function getDocumentChunks(documentId: string) {
  return dakkomFetch<{ chunks: DakkomChunkRecord[] }>("/api/v1/document/chunks/", {
    method: "POST",
    body: JSON.stringify({ document_id: documentId }),
  })
}

export interface DakkomRetrievedDocument {
  chunk_id?: string
  source_file?: string
  document?: string
  probability?: number
  [key: string]: unknown
}

type RagGenerationResult = {
  generated_response: DakkomRagResponse
  retrieved_documents?: DakkomRetrievedDocument[]
}

export async function ragGeneration(payload: Record<string, unknown>) {
  return dakkomFetch<RagGenerationResult>("/api/v1/rag-generation/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Public variant: allow calls without requiring X-API-Key (handled by proxy if present)
export async function ragGenerationPublic(payload: Record<string, unknown>) {
  return dakkomFetch<RagGenerationResult>("/api/v1/rag-generation/", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuthCheck: true,
  })
}

export async function runEvaluation(payload: Record<string, unknown>) {
  return dakkomFetch<{ evaluation_id: string }>("/api/v1/evaluation/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function runRetrievalEvaluation(payload: Record<string, unknown>) {
  return dakkomFetch<{ evaluation_id: string }>("/api/v1/evaluation/retrieval/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Exact helpers matching Flaash API docs
export async function listDocumentNames() {
  return listDocuments()
}

export async function getDocumentChunksByName(documentName: string) {
  return dakkomFetch<{ document_name: string; chunks: Array<{ id: string; value: string; is_validated: boolean; source: string; url: string }> }>(
    "/api/v1/document/chunks/",
    {
      method: "POST",
      body: JSON.stringify({ document_name: documentName }),
    },
  )
}

export async function removeDocumentByName(fileName: string) {
  try {
    return await dakkomFetch<{ message: string; collection_name?: string }>("/api/v1/remove-document/", {
      method: "POST",
      body: JSON.stringify({ file_name: fileName }),
    })
  } catch (e) {
    // Treat "No nodes found for file" as idempotent success
    try {
      const raw = e instanceof Error ? e.message : String(e)
      const parsed = raw && raw.trim().startsWith("{") ? JSON.parse(raw) : undefined
      const err = (parsed?.error as string) || raw
      if (err && err.toLowerCase().includes("no nodes found for file")) {
        return { message: "No-op: file had no nodes", collection_name: "document_collection" }
      }
    } catch {
      // ignore parsing issues
    }
    throw e
  }
}

export async function safeDakkomCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof ApiUnavailableError) {
      return fallback
    }

    const appError = handleError(error)
    if (appError instanceof AppError) {
      throw appError
    }
    throw error
  }
}
