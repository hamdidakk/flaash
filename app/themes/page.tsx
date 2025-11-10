import Link from "next/link"
import { getThemes } from "@/lib/themes"
import { getTranslation, type Language } from "@/lib/i18n"
import { PageSection } from "@/components/public/ui/PageSection"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"
import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"

export const dynamic = "force-dynamic"

function detectLanguage(): Language {
  // Keep it simple server-side to avoid runtime issues; default FR content
  return "fr"
}

export async function generateMetadata() {
  const lang = "fr" as Language
  const title = lang === "fr" ? "Thématiques | FLAASH" : "Themes | FLAASH"
  const description =
    lang === "fr"
      ? "Rubriques principales et pistes d’exploration éditoriale de FLAASH."
      : "FLAASH’s main categories and editorial explorations."
  return {
    title,
    description,
    alternates: { canonical: "/themes" },
  }
}

export default async function ThemesPage() {
  const language = detectLanguage()
  const t = (key: string) => getTranslation(language, key)
  const themes = getThemes(language)

  const firstExample = themes.flatMap((th) => th.examples).find(Boolean) || ""

  return (
    <main id="main">
      <PublicHeader />
      <PageSection>
        <SectionHeader
          title={t("public.themes.title")}
          subtitle={language === "fr" ? "Rubriques principales de FLAASH" : "FLAASH’s main categories"}
          icon="🌐"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {themes.map((th) => (
            <SectionCard key={th.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  <span className="mr-2 select-none">{th.icon}</span>
                  {th.title}
                </h3>
                <p className="mt-2 text-sm text-gray-700">{th.short}</p>
              </div>
              <div className="mt-4">
                <Link
                  href={`/themes/${th.slug}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {language === "fr" ? "Découvrir la thématique →" : "Explore theme →"}
                </Link>
              </div>
            </SectionCard>
          ))}
        </div>

        <div className="mt-8">
          <SectionHeader
            title={language === "fr" ? "Posez une question" : "Ask a question"}
            subtitle={
              language === "fr"
                ? "Interrogez l’Agent IA sur une thématique"
                : "Ask the AI Agent about a theme"
            }
            icon="🤖"
          />
          <QuickAsk
            defaultValue={firstExample}
            placeholder={language === "fr" ? "Ex. : Quelles technologies vont changer nos villes ?" : "Ex.: Which technologies will reshape our cities?"}
            ctaLabel={language === "fr" ? "Interroger l’Agent IA" : "Talk to the AI"}
          />
        </div>
      </PageSection>
      <PublicFooter />
    </main>
  )
}

