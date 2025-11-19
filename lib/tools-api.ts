import { apiFetch } from "@/lib/session-client"
import { handleError } from "@/lib/error-handler"

async function toolsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const { data } = await apiFetch<T>(path, {
      ...(init ?? {}),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    })
    return (data ?? {}) as T
  } catch (error) {
    const appError = handleError(error)
    throw appError
  }
}

export function listDocumentsAdmin() {
  return toolsFetch<{ documents: string[] }>("/api/tools/documents")
}

export function searchVectorStoreAdmin(payload: Record<string, unknown>) {
  return toolsFetch("/api/tools/search", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function ragGenerationAdmin(payload: Record<string, unknown>) {
  return toolsFetch("/api/tools/rag", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function evaluationAdmin(payload: Record<string, unknown>) {
  return toolsFetch("/api/tools/evaluation", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

