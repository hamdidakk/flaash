import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicWidget } from "@/components/public/Widget"
import { PageView } from "@/components/public/PageView"
import { PublicFooter } from "@/components/public/PublicFooter"
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
    <main id="main" style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <PageView page="chat" />
      <section className="hero-future mx-auto max-w-4xl px-4 py-8">
        <PublicWidget />
      </section>
      <PublicFooter />
    </main>
  )
}


