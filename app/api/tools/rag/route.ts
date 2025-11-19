import { NextResponse } from "next/server"
import { DakkomServerError, fetchDakkomServer } from "@/lib/server-dakkom"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await fetchDakkomServer("/api/v1/rag-generation/", {
      method: "POST",
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof DakkomServerError) {
      return NextResponse.json(
        { error: error.message, details: error.payload },
        { status: error.status || 500 },
      )
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

