import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { HomeClient } from "@/components/public/HomeClient"

export default function RootPage() {
  const coverUrl = process.env.NEXT_PUBLIC_FLAASH_COVER_URL || "/talk-ia.png"
  return (
    <main id="main" style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <HomeClient coverUrl={coverUrl} />
      <PublicFooter />
    </main>
  )
}
