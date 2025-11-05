import { fetchWithRetry, handleError, AppError } from "@/lib/error-handler"

export const API_BASE_URL_STORAGE_KEY = "dakkom:api-base-url"
export const API_KEY_STORAGE_KEY = "dakkom:api-key"

const ENV_API_BASE_URL = process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL ?? ""

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
  return ""
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

  const url = `${baseUrl.replace(/\/$/, "")}${endpoint}`

  const isFormDataBody = typeof FormData !== "undefined" && options.body instanceof FormData

  const headers: HeadersInit = {
    ...((!isFormDataBody ? { "Content-Type": "application/json" } : {}) as HeadersInit),
    ...(options.headers || {}),
    ...(apiKey && !options.skipAuthCheck ? ({ "X-API-Key": apiKey } as HeadersInit) : {}),
  }

  try {
    const response = await fetchWithRetry(url, {
      ...options,
      headers,
    })

    const text = await response.text()
    return text ? (JSON.parse(text) as T) : ({} as T)
  } catch (error) {
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
  return dakkomFetch<{ documents: DakkomDocumentRecord[] }>("/api/v1/document/list/", { method: "GET" })
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

export async function ragGeneration(payload: Record<string, unknown>) {
  return dakkomFetch<{ generated_response: DakkomRagResponse }>("/api/v1/rag-generation/", {
    method: "POST",
    body: JSON.stringify(payload),
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
