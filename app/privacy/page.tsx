import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { PrivacyClient } from "@/components/public/PrivacyClient"

export const metadata = {
  title: "Politique de Confidentialité — FLAASH",
  description: "Politique de confidentialité et gestion des données.",
}

export default function PrivacyPage() {
  return (
    <main>
      <PublicHeader />
      <PrivacyClient />
      <PublicFooter />
    </main>
  )
}


