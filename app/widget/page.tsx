"use client"

import { Suspense } from "react"
import { PublicWidget } from "@/components/public/Widget"

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-gray-500">Chargement…</div>}>
      <PublicWidget />
    </Suspense>
  )
}


