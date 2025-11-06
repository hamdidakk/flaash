const ANALYTICS_ENDPOINT = "/api/analytics"

function getAnonId(): string {
  try {
    const key = "anon-id"
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, id)
    return id
  } catch {
    return "anon"
  }
}

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)
      return
    }
    void fetch(ANALYTICS_ENDPOINT, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true })
  } catch {
    // ignore
  }
}

export function trackPageView(page: string, extra?: Record<string, unknown>) {
  try {
    send({
      type: "page_view",
      page,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      ua: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      anonId: typeof window !== "undefined" ? getAnonId() : undefined,
      ts: Date.now(),
      ...(extra || {}),
    })
  } catch {
    // ignore
  }
}

export function trackEvent(name: string, data?: Record<string, unknown>) {
  try {
    send({
      type: "event",
      name,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
      ua: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      anonId: typeof window !== "undefined" ? getAnonId() : undefined,
      ts: Date.now(),
      ...(data || {}),
    })
  } catch {
    // ignore
  }
}


