type OperationKind = "embedding" | "completion" | "search" | "storage" | "other"

interface Snapshot {
  totalCost: number
  tokensUsed: number
  estimatedCost: number
  breakdown: {
    embedding: number
    completion: number
    search: number
    storage: number
  }
  alerts: {
    threshold: number
    current: number
    isNearLimit: boolean
  }
}

const STORAGE_KEY = "dakkom:telemetry:v1"

function load(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

function save(data: Record<string, number>) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function classify(endpoint: string): OperationKind {
  if (endpoint.includes("rag-generation")) return "completion"
  if (endpoint.includes("search-vector-store")) return "search"
  if (endpoint.includes("upload-document") || endpoint.includes("upload-batch")) return "storage"
  if (endpoint.includes("embedding")) return "embedding"
  return "other"
}

export function recordApiCall(endpoint: string, ms: number, bytes: number, ok: boolean) {
  const data = load()
  const kind = classify(endpoint)
  const inc = (key: string, v: number) => {
    data[key] = (data[key] || 0) + v
  }
  inc("calls", 1)
  inc(`ms_${kind}`, ms)
  inc(`bytes_${kind}`, bytes)
  inc(`calls_${kind}`, 1)
  if (!ok) inc("errors", 1)
  save(data)
}

export function getCostSnapshot(): Snapshot {
  const data = load()
  const calls = data["calls"] || 0
  // Very rough estimates for demo: ~1000 tokens per RAG call, ~100 per search
  const tokensCompletion = (data["calls_completion"] || 0) * 1000
  const tokensSearch = (data["calls_search"] || 0) * 100
  const tokens = tokensCompletion + tokensSearch
  // Estimated cost per call (demo): completion 0.02, search 0.003, storage 0.001
  const costCompletion = (data["calls_completion"] || 0) * 0.02
  const costSearch = (data["calls_search"] || 0) * 0.003
  const costStorage = (data["calls_storage"] || 0) * 0.001
  const costEmbedding = (data["calls_embedding"] || 0) * 0.004
  const total = costCompletion + costSearch + costStorage + costEmbedding
  return {
    totalCost: Number(total.toFixed(4)),
    tokensUsed: tokens,
    estimatedCost: Number(total.toFixed(4)),
    breakdown: {
      embedding: Number(costEmbedding.toFixed(4)),
      completion: Number(costCompletion.toFixed(4)),
      search: Number(costSearch.toFixed(4)),
      storage: Number(costStorage.toFixed(4)),
    },
    alerts: {
      threshold: 10, // demo
      current: Number(total.toFixed(4)),
      isNearLimit: total > 8,
    },
  }
}


