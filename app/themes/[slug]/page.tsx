import { notFound } from "next/navigation"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { ThemeDetailClient } from "@/components/public/ThemeDetailClient"
import { fetchPublicTheme } from "@/lib/public-themes"

export const dynamic = "force-dynamic"

export default async function ThemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const theme = await fetchPublicTheme(slug)
  if (!theme) {
    notFound()
  }

  return (
    <main>
      <PublicHeader />
      <ThemeDetailClient theme={theme} />
      <PublicFooter />
    </main>
  )
}
