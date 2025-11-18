import { NextRequest, NextResponse } from "next/server"

const backendBase =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  process.env.DJANGO_BASE_URL ||
  "http://localhost:8000"

type SessionParams = { path?: string[] }
type SessionParamsPromise = Promise<SessionParams>

const buildUpstreamUrl = (pathSegments: string[] = [], search: string) => {
  const normalizedBase = backendBase.replace(/\/$/, "")
  const joined = pathSegments.join("/").replace(/^\/+|\/+$/g, "")
  const upstreamPath = joined ? `/${joined}${joined.endsWith("/") ? "" : "/"}` : "/"
  return `${normalizedBase}/auth/session${upstreamPath}${search}`
}

const forward = async (request: NextRequest, paramsPromise: SessionParamsPromise) => {
  const { pathname, search } = new URL(request.url)
  const resolved = (await paramsPromise) || {}
  const incomingSegments =
    Array.isArray(resolved.path) && resolved.path.length
      ? resolved.path
      : pathname.replace(/^\/api\/session\/?/, "").split("/").filter(Boolean)

  const upstream = buildUpstreamUrl(incomingSegments, search)

  const method = request.method
  const headers = new Headers()

  // Forward cookies/CSRF headers to backend
  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    headers.set("cookie", cookieHeader)
  }
  const csrfHeader =
    request.headers.get("x-csrftoken") ||
    request.headers.get("x-csrf-token") ||
    request.headers.get("x-xsrf-token")
  if (csrfHeader) {
    headers.set("x-csrftoken", csrfHeader)
  }
  const referer = request.headers.get("referer")
  if (referer) {
    headers.set("referer", referer)
  }

  const contentType = request.headers.get("content-type") || ""
  let body: BodyInit | undefined

  if (method !== "GET" && method !== "HEAD") {
    if (contentType.toLowerCase().startsWith("multipart/form-data")) {
      body = request.body as unknown as BodyInit
      headers.set("content-type", contentType)
    } else if (contentType.toLowerCase().startsWith("application/json")) {
      const text = await request.text()
      body = text
      headers.set("content-type", "application/json")
    } else {
      const text = await request.text()
      if (text) body = text
      if (contentType) headers.set("content-type", contentType)
    }
  }

  const upstreamResponse = await fetch(upstream, {
    method,
    headers,
    body,
    redirect: "manual",
  })

  const respHeaders = new Headers(upstreamResponse.headers)

  const setCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : upstreamResponse.headers.get("set-cookie")

  if (Array.isArray(setCookies)) {
    respHeaders.delete("set-cookie")
    setCookies.forEach((cookie) => respHeaders.append("set-cookie", cookie))
  } else if (setCookies) {
    respHeaders.set("set-cookie", setCookies)
  }

  const response = new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: respHeaders,
  })
  return response
}

export async function GET(req: NextRequest, ctx: { params: SessionParamsPromise }) {
  return forward(req, ctx.params)
}

export async function POST(req: NextRequest, ctx: { params: SessionParamsPromise }) {
  return forward(req, ctx.params)
}

export async function PUT(req: NextRequest, ctx: { params: SessionParamsPromise }) {
  return forward(req, ctx.params)
}

export async function PATCH(req: NextRequest, ctx: { params: SessionParamsPromise }) {
  return forward(req, ctx.params)
}

export async function DELETE(req: NextRequest, ctx: { params: SessionParamsPromise }) {
  return forward(req, ctx.params)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRFToken",
    },
  })
}

