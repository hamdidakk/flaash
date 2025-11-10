"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { getThemes } from "@/lib/themes"
import { PageSection } from "@/components/public/ui/PageSection"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"

export default function ThemesPage() {
  const { t, language } = useLanguage()
  const themes = getThemes(language)

  const firstExample = themes.flatMap((th) => th.examples).find(Boolean) || ""

  return (
    <main id="main">
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
    </main>
  )
}


