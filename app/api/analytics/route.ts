import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Minimal: log server-side for now
    console.info("[analytics]", JSON.stringify({ ...body }, null, 2))
  } catch (e) {
    console.warn("[analytics] invalid payload", e)
  }
  return new NextResponse(null, { status: 204 })
}


