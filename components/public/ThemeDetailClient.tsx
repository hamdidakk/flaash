"use client"

import { useMemo } from "react"
import { ThemeVisual } from "@/components/public/blocks/ThemeVisual"
import { PageSection } from "@/components/public/ui/PageSection"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { ChatLink } from "@/components/public/ui/ChatLink"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import type { PublicTheme } from "@/lib/public-themes"

type ThemeDetailClientProps = {
  theme: PublicTheme
}

export function ThemeDetailClient({ theme }: ThemeDetailClientProps) {
  const { language } = useLanguage()
  const copy = (translations as any)[language]?.public?.themesPage
  const promptSectionTitle = language === "fr" ? "Prompts recommandés" : "Recommended prompts"
  const promptSectionDescription =
    language === "fr"
      ? "Cliquez sur une question pour l’envoyer vers l’Agent IA public."
      : "Click on a question to send it directly to the public AI Agent."
  const exploreLabel = language === "fr" ? "Explorer toutes les questions" : "Browse all prompts"

  const promptChunks = useMemo(() => {
    const size = 3
    const prompts = theme.prompts ?? []
    const result: string[][] = []
    for (let i = 0; i < prompts.length; i += size) {
      result.push(prompts.slice(i, i + size))
    }
    return result
  }, [theme.prompts])

  const ctaChatLabel = copy?.ctaChat || (language === "fr" ? "Parler à l’IA" : "Talk to the AI")
  const firstPrompt = theme.prompts?.[0] || theme.title

  return (
    <>
      <section className="public-theme-detail__hero">
        <ThemeVisual
          slug={theme.slug}
          icon={theme.icon || "📚"}
          title={theme.title}
          subtitle={theme.subtitle}
          tag={theme.tag}
          variant="hero"
        />
        <div className="public-theme-detail__intro">
          {(theme.excerpt || theme.description) && (
            <p>{theme.excerpt || theme.description}</p>
          )}
          {theme.stats && theme.stats.length > 0 ? (
            <div className="public-theme-detail__stats">
              {theme.stats.map((stat) => (
                <div key={`${theme.slug}-${stat.label}`}>
                  <span>{stat.value}</span>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="public-theme-detail__cta">
            <ButtonCTA href={`/chat?prefill=${encodeURIComponent(firstPrompt)}`}>{ctaChatLabel}</ButtonCTA>
            <ButtonCTA href="/chat" className="public-cta-secondary">
              {exploreLabel}
            </ButtonCTA>
          </div>
        </div>
      </section>

      <PageSection className="public-theme-detail">
        <SectionHeader title={promptSectionTitle} description={promptSectionDescription} />

        {promptChunks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun prompt n’est disponible pour cette thématique.</p>
        ) : (
          <div className="public-theme-detail__prompts">
            {promptChunks.map((chunk, index) => (
              <div key={`chunk-${index}`} className="public-theme-detail__prompt-column">
                {chunk.map((prompt) => (
                  <ChatLink
                    key={prompt}
                    href={`/chat?prefill=${encodeURIComponent(prompt)}`}
                    className="public-theme-detail__prompt"
                  >
                    {prompt}
                  </ChatLink>
                ))}
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </>
  )
}

