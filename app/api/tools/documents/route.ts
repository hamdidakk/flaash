import { NextResponse } from "next/server"
import { fetchDakkomServer, DakkomServerError } from "@/lib/server-dakkom"

export async function GET() {
  try {
    const data = await fetchDakkomServer<{ documents: string[] }>("/api/v1/document/list/")
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

