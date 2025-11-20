import type { Metadata } from "next"
import type React from "react"

import "@/app/globals.css"
import { RagAppShell } from "@/components/rag/RagAppShell"

export const metadata: Metadata = {
  title: "FLAASH RAG",
  description: "Explorez l'Agent IA FLAASH dans un environnement dédié.",
}

export default function RagLayout({ children }: { children: React.ReactNode }) {
  return <RagAppShell>{children}</RagAppShell>
}

