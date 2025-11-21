import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { HomeClient } from "@/components/public/HomeClient"

export default function RagPage() {
  const coverUrl = process.env.NEXT_PUBLIC_FLAASH_COVER_URL || "/talk-ia.png"
  return (
    <main id="main">
      <PublicHeader />
      <HomeClient coverUrl={coverUrl} />
      <PublicFooter />
    </main>
  )
}

