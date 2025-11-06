import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { SubscriptionClient } from "@/components/public/SubscriptionClient"

export const metadata = {
  title: "Abonnement — FLAASH",
  description: "Choisissez votre formule: accès public ou abonné avec usage avancé et illimité.",
  openGraph: {
    title: "Abonnement — FLAASH",
    description: "Choisissez votre formule: accès public ou abonné avec usage avancé et illimité.",
    url: "https://flaash.fr/abonnement",
    type: "website",
  },
}

export default function SubscriptionPage() {
  return (
    <main style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <SubscriptionClient />
      <PublicFooter />
    </main>
  )
}


