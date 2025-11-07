import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { LegalClient } from "@/components/public/LegalClient"

export const metadata = {
  title: "Mentions Légales / CGU — FLAASH",
  description: "Mentions légales et conditions générales d’utilisation.",
}

export default function LegalPage() {
  return (
    <main>
      <PublicHeader />
      <LegalClient />
      <PublicFooter />
    </main>
  )
}


