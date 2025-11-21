"use client"

import type React from "react"
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import "@/app/globals.css"
import { RagAppShell } from "@/components/rag/RagAppShell"
import { RagGuard } from "@/components/rag/RagGuard"

export default function RagLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Si on est sur /rag exactement, ne pas utiliser RagAppShell ni RagGuard (c'est la page publique)
  // Sinon, utiliser RagGuard et RagAppShell pour les sous-routes (/rag/documents, etc.)
  const shouldUseShell = useMemo(() => pathname !== "/rag", [pathname])
  
  if (!shouldUseShell) {
    return <>{children}</>
  }
  
  return (
    <RagGuard>
      <RagAppShell>{children}</RagAppShell>
    </RagGuard>
  )
}
