import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { ThemesPageClient } from "@/components/public/ThemesPageClient"
import { fetchPublicThemes } from "@/lib/public-themes"

export const dynamic = "force-dynamic"

export default async function ThemesPage() {
  const themes = await fetchPublicThemes()
  return (
    <main>
      <PublicHeader />
      <ThemesPageClient themes={themes} />
      <PublicFooter />
    </main>
  )
}
