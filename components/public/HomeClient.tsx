"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { PageView } from "@/components/public/PageView"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { Ticker } from "@/components/public/blocks/Ticker"
import { ThemeGrid } from "@/components/public/blocks/ThemeGrid"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"
import { TalkToIAIcon } from "@/components/public/blocks/TalkToIAIcon"
import { HeroSplit } from "@/components/public/blocks/HeroSplit"
import { SecondaryCTA } from "@/components/public/ui/SecondaryCTA"
import { PageSection } from "@/components/public/ui/PageSection"

export function HomeClient({ coverUrl: _coverUrl }: { coverUrl: string }) {
  const { t } = useLanguage()
  return (
    <>
      <PageView page="home" />

      <HeroSplit
        className="hero-future"
        heading={t("public.hero.title")}
        subtitle={t("public.hero.subtitle")}
        primaryCta={
          <ButtonCTA href="/chat" icon={<span>💬</span>}>
            {t("public.hero.ctaChat")}
          </ButtonCTA>
        }
        secondaryCta={
          <SecondaryCTA href="https://boutique.flaash.fr" external event="cta_boutique_hero" icon={<span>📰</span>}>
            {t("public.hero.ctaShop")}
          </SecondaryCTA>
        }
        right={
          <SectionCard className="public-hero__panel" hover={false}>
            <TalkToIAIcon caption={t("public.hero.greeting")} ctaLabel={t("public.hero.ctaChat")} />
          </SectionCard>
        }
      >
        <div aria-hidden className="public-hero__background" />
      </HeroSplit>

      <PageSection py="8">
        <div className="public-feature-grid">
          {[
            { icon: "💡", text: t("public.why.one") },
            { icon: "🔎", text: t("public.why.two") },
            { icon: "🧠", text: t("public.why.three") },
            { icon: "🌍", text: t("public.why.four") },
          ].map((it) => (
            <SectionCard key={it.text} hover={false} className="public-feature-card">
              <div className="public-feature-card__text">
                <span className="public-feature-card__icon">{it.icon}</span>
                {it.text}
              </div>
            </SectionCard>
          ))}
        </div>
      </PageSection>

      <Ticker
        ariaLabel="Exemples de questions"
        items={[
          t("public.themes.surveillance.example"),
          t("public.themes.ai.example"),
          t("public.themes.environment.example"),
          t("public.themes.education.example"),
        ]}
      />

      <PageSection py="10">
        <div className="public-hero__card card-future">
          <h2 className="public-hero__card-heading">{t("public.hero.title")}</h2>
          <p className="public-hero__card-subtitle">{t("public.hero.subtitle")}</p>
          <div className="public-hero__card-footer">
            <TrackedLink href="/chat" event="cta_chat_agent_block" className="public-cta-futuriste cta-futuriste">
              {t("public.hero.ctaExplore")}
            </TrackedLink>
          </div>
        </div>
      </PageSection>

      <PageSection className="public-home__themes">
        <SectionHeader as="h3" title={t("public.themes.title")} icon={<span>🌐</span>} className="public-section-heading" />
        <ThemeGrid
          themes={[
            { icon: "👁️", title: t("public.themes.surveillance.title"), prompts: [t("public.themes.surveillance.example")] },
            { icon: "🤖", title: t("public.themes.ai.title"), prompts: [t("public.themes.ai.example")] },
            { icon: "⚠️", title: t("public.themes.shortages.title"), prompts: [t("public.themes.shortages.example")] },
            { icon: "🎓", title: t("public.themes.education.title"), prompts: [t("public.themes.education.example")] },
            { icon: "🩺", title: t("public.themes.health.title"), prompts: [t("public.themes.health.example")] },
            { icon: "🌿", title: t("public.themes.environment.title"), prompts: [t("public.themes.environment.example")] },
          ]}
        />
        <div className="public-home__themes-footer">
          <Link href="/chat" className="public-home__themes-link">
            Voir tous les thèmes →
          </Link>
        </div>
      </PageSection>

      <PageSection className="public-agent-section">
        <SectionCard hover={false} className="public-agent-card">
          <div className="public-agent__title">{t("public.agent.title")}</div>
          <QuickAsk defaultValue={t("public.themes.ai.example")} placeholder={t("public.chat.placeholder")} ctaLabel={t("public.agent.ctaChat")} />
        </SectionCard>
      </PageSection>
    </>
  )
}



