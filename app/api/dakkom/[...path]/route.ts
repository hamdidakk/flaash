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

async function forward(
  request: NextRequest,
  paramsInput: { path?: string[] } | Promise<{ path?: string[] }>,
) {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return NextResponse.json({ error: "API base URL not configured" }, { status: 500 })
  }

  const apiKey = getApiKey()
  const url = new URL(request.url)
  const resolved = (await paramsInput) || {}
  let path = Array.isArray(resolved.path) ? resolved.path.join("/") : ""
  if (!path) {
    // Fallback: derive from pathname if dynamic param missing
    path = url.pathname.replace(/^\/api\/dakkom\//, "")
  }
  path = path.replace(/^\/+/, "").replace(/\/+$/, "")
  // Django expects trailing slash (APPEND_SLASH=True). Always include it for upstream paths.
  const upstreamPath = path ? (path.endsWith("/") ? path : `${path}/`) : ""
  const upstream = `${baseUrl.replace(/\/$/, "")}/${upstreamPath}${url.search}`

  const method = request.method
  const incomingContentType = request.headers.get("content-type") || ""

  let body: BodyInit | undefined
  let headers = new Headers()

  // Always attach API key for backend
  if (apiKey) {
    headers.set("X-API-Key", apiKey)
  }

  // Preserve content-type for non-multipart payloads
  if (method !== "GET" && method !== "HEAD") {
    if (incomingContentType.toLowerCase().startsWith("multipart/form-data")) {
      // Stream the raw body to avoid buffering and re-encoding large files
      body = request.body as unknown as BodyInit
      if (incomingContentType) headers.set("content-type", incomingContentType)
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

  const resp = await fetch(upstream, {
    method,
    headers,
    body,
    // Don't send credentials cross-origin
    cache: "no-store",
  })

  const respHeaders = new Headers(resp.headers)
  // Ensure same-origin responses are consumable by the browser
  respHeaders.set("Access-Control-Allow-Origin", "*")

  const contentType = respHeaders.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const data = await resp.text()
    return new NextResponse(data || "{}", { status: resp.status, headers: respHeaders })
  }
  const buf = await resp.arrayBuffer()
  return new NextResponse(buf, { status: resp.status, headers: respHeaders })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } }) {
  return forward(req, ctx.params)
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } }) {
  return forward(req, ctx.params)
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } }) {
  return forward(req, ctx.params)
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } }) {
  return forward(req, ctx.params)
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } }) {
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


