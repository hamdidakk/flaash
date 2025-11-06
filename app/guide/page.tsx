import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { GuideClient } from "@/components/public/GuideClient"

export const metadata = {
  title: "Guide FLAASH — Comment ça marche",
  description:
    "Comprendre FLAASH et l’Agent IA public : fonctionnement, citations, limites, confidentialité, et liens vers la boutique.",
  openGraph: {
    title: "Guide FLAASH — Comment ça marche",
    description:
      "Comprendre FLAASH et l’Agent IA public : fonctionnement, citations, limites, confidentialité, et liens vers la boutique.",
    url: "https://flaash.fr/guide",
    type: "article",
  },
}

export default function GuidePage() {
  return (
    <main style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <GuideClient />
      <PublicFooter />
    </main>
  )
}


