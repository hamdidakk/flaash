import { NextRequest, NextResponse } from "next/server"

const baseUrl = (process.env.NEXT_PUBLIC_DAKKOM_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "")
const apiKey = process.env.NEXT_PUBLIC_DAKKOM_API_KEY || process.env.NEXT_PUBLIC_API_KEY || ""

export async function POST(req: NextRequest) {
  if (!baseUrl) return NextResponse.json({ error: "API base URL not configured" }, { status: 500 })
  const body = await req.text()
  const resp = await fetch(`${baseUrl}/api/v1/evaluation/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { "X-API-Key": apiKey } : {}),
    },
    body,
    cache: "no-store",
  })
  const text = await resp.text()
  const headers = new Headers(resp.headers)
  headers.set("content-type", "application/json")
  return new NextResponse(text || "{}", { status: resp.status, headers })
}


