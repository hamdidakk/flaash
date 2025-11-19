import { NextRequest, NextResponse } from "next/server"

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.DAKKOM_API_BASE_URL ||
    ""
  )
}

const getApiKey = () => {
  return (
    process.env.NEXT_PUBLIC_DAKKOM_API_KEY ||
    process.env.NEXT_PUBLIC_API_KEY ||
    process.env.DAKKOM_API_KEY ||
    ""
  )
}

type DakkomParams = { path?: string[] }
type DakkomParamsPromise = Promise<DakkomParams>

async function forward(
  request: NextRequest,
  paramsPromise: DakkomParamsPromise,
) {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return NextResponse.json({ error: "API base URL not configured" }, { status: 500 })
  }

  const apiKey = getApiKey()
  const url = new URL(request.url)
  const resolved = (await paramsPromise) || {}
  let path = Array.isArray(resolved.path) ? resolved.path.join("/") : ""
  if (!path) {
    // Fallback: derive from pathname if dynamic param missing
    path = url.pathname.replace(/^\/api\/dakkom\//, "")
  }
  path = path.replace(/^\/+/, "").replace(/\/+$/, "")
  // Django expects trailing slash (APPEND_SLASH=True). Always include it for upstream paths.
  const upstreamPath = path ? (path.endsWith("/") ? path : `${path}/`) : ""
  const upstream = `${baseUrl.replace(/\/$/, "")}/${upstreamPath}${url.search}`
  const normalizedPath = upstreamPath.toLowerCase()
  const isSessionOrPartnerRoute = normalizedPath.startsWith("auth/session") || normalizedPath.startsWith("auth/partner")
  
  const method = request.method
  const incomingContentType = request.headers.get("content-type") || ""

  let body: BodyInit | undefined
  let headers = new Headers()

  // Forward cookies from client to backend (for session authentication)
  const cookieHeader = request.headers.get("cookie")
  
  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[dakkom-proxy] Request:", {
      method,
      pathname: url.pathname,
      extractedPath: path,
      upstreamPath,
      upstream,
      hasCookies: !!cookieHeader,
      hasApiKey: !!(apiKey && apiKey.trim() !== ""),
    })
  }
  if (cookieHeader) {
    headers.set("cookie", cookieHeader)
  }

  // Forward CSRF token if present
  const csrfHeader =
    request.headers.get("x-csrftoken") ||
    request.headers.get("x-csrf-token") ||
    request.headers.get("x-xsrf-token")
  if (csrfHeader) {
    headers.set("x-csrftoken", csrfHeader)
  }

  // Attach API key only for non-session routes AND only if it has a valid value
  // According to backend requirements: don't send empty, null, or undefined API keys
  if (apiKey && apiKey.trim() !== "" && !isSessionOrPartnerRoute) {
    headers.set("X-API-Key", apiKey)
  }

  // Track if we're using a streaming body (FormData)
  let isStreamingBody = false
  
  // Preserve content-type for non-multipart payloads
  if (method !== "GET" && method !== "HEAD") {
    if (incomingContentType.toLowerCase().startsWith("multipart/form-data")) {
      // For FormData, we need to read the body as ArrayBuffer to preserve the multipart encoding
      // Reading as ArrayBuffer maintains the boundary and all form fields
      const arrayBuffer = await request.arrayBuffer()
      body = arrayBuffer
      isStreamingBody = true
      // Preserve the Content-Type with boundary for multipart/form-data
      if (incomingContentType) {
        headers.set("content-type", incomingContentType)
      }
      
      // Debug logging for FormData uploads
      if (process.env.NODE_ENV === "development") {
        console.log("[dakkom-proxy] FormData upload:", {
          method,
          upstream,
          contentType: incomingContentType,
          bodySize: arrayBuffer.byteLength,
        })
      }
    } else if (incomingContentType.toLowerCase().startsWith("application/json")) {
      const text = await request.text()
      body = text
      headers.set("content-type", "application/json")
    } else {
      const text = await request.text()
      if (text) body = text
      if (incomingContentType) headers.set("content-type", incomingContentType)
    }
  }

  // For ReadableStream bodies (FormData uploads), duplex option is required
  // This is a requirement in Node.js/Next.js when using streaming bodies
  const fetchOptions: RequestInit & { duplex?: "half" } = {
    method,
    headers,
    body,
    cache: "no-store",
  }
  
  // Add duplex option for streaming bodies (required in Node.js/Next.js)
  if (isStreamingBody) {
    fetchOptions.duplex = "half"
  }
  
  const resp = await fetch(upstream, fetchOptions)

  // Debug logging for errors in development
  if (process.env.NODE_ENV === "development" && !resp.ok) {
    // Try to read error message from response (but don't consume the body if we need to forward it)
    let errorBody = ""
    try {
      const clonedResp = resp.clone()
      errorBody = await clonedResp.text().catch(() => "")
      // Try to parse as JSON
      try {
        const json = JSON.parse(errorBody)
        errorBody = JSON.stringify(json, null, 2)
      } catch {
        // Not JSON, keep as text
      }
    } catch {
      // Failed to read error body
    }
    
    console.error("[dakkom-proxy] Error response:", {
      status: resp.status,
      statusText: resp.statusText,
      upstream,
      method,
      hasCookies: !!cookieHeader,
      hasApiKey: !!(apiKey && apiKey.trim() !== ""),
      errorBody: errorBody.substring(0, 500), // First 500 chars
    })
  }

  const respHeaders = new Headers(resp.headers)
  // Ensure same-origin responses are consumable by the browser
  respHeaders.set("Access-Control-Allow-Origin", "*")

  // Forward set-cookie headers from backend to client (for session cookies)
  const setCookies =
    typeof resp.headers.getSetCookie === "function"
      ? resp.headers.getSetCookie()
      : resp.headers.get("set-cookie")

  if (Array.isArray(setCookies)) {
    respHeaders.delete("set-cookie")
    setCookies.forEach((cookie) => respHeaders.append("set-cookie", cookie))
  } else if (setCookies) {
    respHeaders.set("set-cookie", setCookies)
  }

  const contentType = respHeaders.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const data = await resp.text()
    return new NextResponse(data || "{}", { status: resp.status, headers: respHeaders })
  }
  const buf = await resp.arrayBuffer()
  return new NextResponse(buf, { status: resp.status, headers: respHeaders })
}

export async function GET(req: NextRequest, ctx: { params: DakkomParamsPromise }) {
  return forward(req, ctx.params)
}
export async function POST(req: NextRequest, ctx: { params: DakkomParamsPromise }) {
  return forward(req, ctx.params)
}
export async function PUT(req: NextRequest, ctx: { params: DakkomParamsPromise }) {
  return forward(req, ctx.params)
}
export async function PATCH(req: NextRequest, ctx: { params: DakkomParamsPromise }) {
  return forward(req, ctx.params)
}
export async function DELETE(req: NextRequest, ctx: { params: DakkomParamsPromise }) {
  return forward(req, ctx.params)
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
    },
  })
}


