import { NextRequest, NextResponse } from "next/server"

const baseUrl = (process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "")
const apiKey = process.env.NEXT_PUBLIC_DAKKOM_API_KEY || process.env.NEXT_PUBLIC_API_KEY || ""

export async function POST(req: NextRequest) {
  if (!baseUrl) return NextResponse.json({ error: "API base URL not configured" }, { status: 500 })
  const body = await req.text()
  
  const headers: Record<string, string> = {
    "content-type": "application/json",
  }
  
  // Forward cookies from client to backend (for session authentication)
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    headers["cookie"] = cookieHeader
  }
  
  // Forward CSRF token if present
  const csrfHeader =
    req.headers.get("x-csrftoken") ||
    req.headers.get("x-csrf-token") ||
    req.headers.get("x-xsrf-token")
  if (csrfHeader) {
    headers["x-csrftoken"] = csrfHeader
  }
  
  // Attach API key only if it has a valid value (not empty, null, or undefined)
  if (apiKey && apiKey.trim() !== "") {
    headers["X-API-Key"] = apiKey
  }
  
  const resp = await fetch(`${baseUrl}/api/v1/evaluation/`, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  })
  
  const text = await resp.text()
  const responseHeaders = new Headers(resp.headers)
  responseHeaders.set("content-type", "application/json")
  
  // Forward set-cookie headers from backend to client
  const setCookies =
    typeof resp.headers.getSetCookie === "function"
      ? resp.headers.getSetCookie()
      : resp.headers.get("set-cookie")
  
  if (Array.isArray(setCookies)) {
    responseHeaders.delete("set-cookie")
    setCookies.forEach((cookie) => responseHeaders.append("set-cookie", cookie))
  } else if (setCookies) {
    responseHeaders.set("set-cookie", setCookies)
  }
  
  return new NextResponse(text || "{}", { status: resp.status, headers: responseHeaders })
}


