"use client"

import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import Link from "next/link"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { useEffect, useState } from "react"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { AnchorNav } from "@/components/public/ui/AnchorNav"
import { Timeline } from "@/components/public/blocks/Timeline"
import { HeroSplit } from "@/components/public/blocks/HeroSplit"
import { SecondaryCTA } from "@/components/public/ui/SecondaryCTA"
import { PageSection } from "@/components/public/ui/PageSection"

export default function AboutPage() {
  const { t, language } = useLanguage()
  const items: string[] = (translations as any)?.[language]?.public?.about?.what?.items ?? []
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <main>
      <PublicHeader />
      <HeroSplit
        className="public-about__hero"
        containerClassName="py-16"
        heading={<span className="public-about__title">{t("public.about.title")}</span>}
        subtitle={<span className="public-about__subtitle">{t("public.about.p1")}</span>}
        right={
          <SectionCard variant="surface" className="public-guide__hero-card" hover={false}>
            🧭
          </SectionCard>
        }
      />

      <PageSection className="public-about">
        <AnchorNav
          ariaLabel={language === "fr" ? "Sommaire" : "Table of contents"}
          items={[
            { href: "#mission", label: t("public.about.mission.title") },
            { href: "#approche", label: t("public.about.approach.title") },
            { href: "#publications", label: t("public.about.what.title") },
            { href: "#equipe", label: t("public.about.team.title") },
            { href: "#agent", label: t("public.about.agent.title") },
            { href: "#histoire", label: t("public.about.history.title") },
          ]}
        />

        <div className="public-about__grid">
          <SectionCard className="fade-in-up md:col-span-2">
            <SectionHeader title={t("public.about.mission.title")} icon={<span>🧭</span>} />
            <p className="public-about__card-text">{t("public.about.mission.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.approach.title")} icon={<span>🧠</span>} />
            <p className="public-about__card-text">{t("public.about.approach.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up md:col-span-2">
            <SectionHeader title={t("public.about.agent.title")} icon={<span>🤖</span>} />
            <p className="public-about__card-text">{t("public.about.agent.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.what.title")} icon={<span>✍️</span>} />
            <ul className="public-about__list">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.team.title")} icon={<span>👥</span>} />
            <p className="public-about__card-text">{t("public.about.team.p")}</p>
          </SectionCard>
        </div>

        <SectionCard className="mt-12 fade-in-up" id="histoire">
          <SectionHeader as="h3" title={t("public.about.history.title")} icon={<span>⏳</span>} />
          <Timeline
            items={[
              { label: `${t("public.about.history.a.y")}`, description: t("public.about.history.a.p"), icon: <span>🧪</span> },
              { label: `${t("public.about.history.b.y")}`, description: t("public.about.history.b.p"), icon: <span>📚</span> },
              { label: `${t("public.about.history.c.y")}`, description: t("public.about.history.c.p"), icon: <span>🚀</span> },
            ]}
          />
        </SectionCard>

        <div className="public-about__cta-group">
          <ButtonCTA href="/chat" icon={<span>🤖</span>}>
            {t("public.about.ctas.chat")}
          </ButtonCTA>
          <SecondaryCTA href="https://boutique.flaash.fr" external event="about_shop" icon={<span>🛒</span>}>
            {t("public.about.ctas.shop")}
          </SecondaryCTA>
          <SecondaryCTA href="/guide" event="about_guide" icon={<span>📘</span>}>
            {t("public.about.ctas.guide")}
          </SecondaryCTA>
        </div>

        {showTop && (
          <button
            type="button"
            aria-label="Revenir en haut"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="public-about__back-to-top"
          >
            ↑
          </button>
        )}
      </PageSection>
      <PublicFooter />
    </main>
  )
}


