"use client"

import Link from "next/link"
import { ThemeVisual } from "@/components/public/blocks/ThemeVisual"
import { ThemeGrid, type Theme } from "@/components/public/blocks/ThemeGrid"
import { PageSection } from "@/components/public/ui/PageSection"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import type { PublicTheme } from "@/lib/public-themes"

type ThemesPageClientProps = {
  themes: PublicTheme[]
}

export function ThemesPageClient({ themes }: ThemesPageClientProps) {
  const { language, t } = useLanguage()
  const copy = (translations as any)[language]?.public?.themesPage
  const cardsDescription =
    language === "fr"
      ? "Cartes thématiques issues de la revue et accessibles dans l'Agent IA public."
      : "Curated clusters from the magazine, all available inside the public AI Agent."
  const promptsDescription =
    language === "fr"
      ? "Cliquez pour pré-remplir l'Agent IA FLAASH avec des prompts contextualisés."
      : "Click to prefill the FLAASH AI Agent with contextual prompts."

  // Trier les thèmes par display_order
  const sortedThemes = [...themes].sort((a, b) => a.display_order - b.display_order)
  const heroTheme = sortedThemes[0]
  const secondaryThemes = sortedThemes.slice(1)
  const promptThemes: Theme[] = sortedThemes.map((theme) => ({
    icon: theme.icon || "📚",
    title: theme.title,
    prompts: theme.prompts?.slice(0, 3) ?? [],
  }))

  if (!heroTheme) {
    return (
      <PageSection className="public-themes-page">
        <p className="public-themes-notice">Aucune thématique n’est publiée pour le moment.</p>
      </PageSection>
    )
  }

  return (
    <>
      <section className="public-themes-hero">
        <div className="public-themes-hero__text">
          <p className="public-themes-hero__eyebrow">{copy?.title || "Thématiques & prompts"}</p>
          <h1>{heroTheme.title}</h1>
          <p className="public-themes-hero__subtitle">{copy?.intro}</p>
          <div className="public-themes-hero__cta">
            <ButtonCTA href={`/themes/${heroTheme.slug}`} icon={<span>{heroTheme.icon || "📚"}</span>}>
              {copy?.ctaDetail || "Découvrir la thématique"}
            </ButtonCTA>
            <ButtonCTA
              href={`/chat?prefill=${encodeURIComponent(heroTheme.prompts?.[0] || heroTheme.title)}`}
              className="public-cta-secondary"
            >
              {copy?.ctaChat || t("public.navExtra.exploreAI")}
            </ButtonCTA>
          </div>
        </div>
        <ThemeVisual
          slug={heroTheme.slug}
          icon={heroTheme.icon || "📚"}
          title={heroTheme.title}
          subtitle={heroTheme.subtitle}
          tag={heroTheme.tag}
          variant="hero"
        />
      </section>

      <PageSection className="public-themes-page">
        <SectionHeader title={copy?.cardsTitle || "Explorez les terrains d’enquête"} description={cardsDescription} />
        <div className="public-themes-cards">
          {secondaryThemes.map((theme) => (
            <Link key={theme.slug} href={`/themes/${theme.slug}`} className="public-theme-card-link">
              <ThemeVisual
                slug={theme.slug}
                icon={theme.icon || "📚"}
                title={theme.title}
                subtitle={theme.subtitle}
                tag={theme.tag}
              />
              <div className="public-theme-card-link__body">
                {(theme.excerpt || theme.description) && (
                  <p>{theme.excerpt || theme.description}</p>
                )}
                {theme.stats && theme.stats.length > 0 ? (
                  <div className="public-theme-stats">
                    {theme.stats.map((stat) => (
                      <div key={`${theme.slug}-${stat.label}`}>
                        <span>{stat.value}</span>
                        <p>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <SectionHeader className="mt-16" title={copy?.promptsTitle || "Essayez ces questions"} description={promptsDescription} />
        <ThemeGrid themes={promptThemes} />
      </PageSection>
    </>
  )
}

