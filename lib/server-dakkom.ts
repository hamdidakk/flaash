import { handleError } from "@/lib/error-handler"

const BASE_URL =
  process.env.DAKKOM_API_BASE_URL ??
  process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  ""

const API_KEY = process.env.DAKKOM_API_KEY ?? process.env.NEXT_PUBLIC_DAKKOM_API_KEY ?? ""

export class DakkomServerError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = "DakkomServerError"
    this.status = status
    this.payload = payload
  }
}

function buildUrl(path: string) {
  if (!BASE_URL) {
    throw new DakkomServerError("Missing Dakkom API base URL", 500, null)
  }
  const cleanBase = BASE_URL.replace(/\/$/, "")
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export async function fetchDakkomServer<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    const url = buildUrl(path)
    const headers = new Headers(init.headers ?? undefined)

    const isJsonPayload = !(init.body instanceof FormData)
    if (isJsonPayload && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
    if (API_KEY) {
      headers.set("X-API-Key", API_KEY)
    }

    const response = await fetch(url, {
      ...init,
      headers,
    })

    const text = await response.text()
    const payload = text ? (() => { try { return JSON.parse(text) } catch { return text } })() : null

    if (!response.ok) {
      const message =
        (payload && typeof payload === "object" && "error" in payload
          ? String((payload as Record<string, unknown>).error)
          : response.statusText) || "Dakkom API error"
      throw new DakkomServerError(message, response.status, payload)
    }

    return (payload ?? {}) as T
  } catch (error) {
    if (error instanceof DakkomServerError) {
      throw error
    }
    const appError = handleError(error)
    throw new DakkomServerError(appError.message, 500, appError)
  }
}

