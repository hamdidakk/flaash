import { Suspense } from "react"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicWidget } from "@/components/public/Widget"
import { PageView } from "@/components/public/PageView"
export const metadata = {
  title: "Chat FLAASH — Agent IA public",
  description:
    "Posez vos questions et obtenez des réponses sourcées par l’Agent IA public de FLAASH.",
  openGraph: {
    title: "Chat FLAASH — Agent IA public",
    description:
      "Posez vos questions et obtenez des réponses sourcées par l’Agent IA public de FLAASH.",
    url: "https://flaash.fr/chat",
    type: "website",
  },
}

export default function PublicChatPage() {
  return (
    <main id="main" className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PublicHeader />
      <PageView page="chat" />
      <section className="mx-auto w-full max-w-3xl px-4 py-8">
        <Suspense fallback={<div className="text-center text-sm text-gray-500">Chargement…</div>}>
          <PublicWidget />
        </Suspense>
      </section>
    </main>
  )
}


