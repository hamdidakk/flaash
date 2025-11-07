"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { PageView } from "@/components/public/PageView"
import { useState } from "react"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { Ticker } from "@/components/public/blocks/Ticker"
import { ThemeGrid } from "@/components/public/blocks/ThemeGrid"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"
import { TalkToIAIcon } from "@/components/public/blocks/TalkToIAIcon"

export function HomeClient({ coverUrl }: { coverUrl: string }) {
  const { t } = useLanguage()
  return (
    <>
      <PageView page="home" />

      <section className="relative bg-gradient-to-b from-white to-gray-50 hero-future">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.06] [background:radial-gradient(circle_at_30%_20%,#141A2A_0%,#0A0C14_70%)]" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
          <div className="fade-in-up">
            <h1 className="display-title text-3xl tracking-tight md:text-4xl">{t("public.hero.title")}</h1>
            <p className="mt-3 text-gray-600">{t("public.hero.subtitle")}</p>
            <div className="mt-6 flex gap-4">
              <ButtonCTA href="/chat" className="group" icon={<span>💬</span>}>
                {t("public.hero.ctaChat")}
              </ButtonCTA>
              <TrackedLink
                href="https://boutique.flaash.fr"
                external
                event="cta_boutique_hero"
                className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <span aria-hidden>📰</span>
                <span className="ml-2">{t("public.hero.ctaShop")}</span>
              </TrackedLink>
            </div>
          </div>
          <SectionCard className="transition-transform hover:translate-y-1 bg-[#0b1120] text-white border-transparent md:-mt-2">
            <TalkToIAIcon caption={t("public.hero.greeting")} ctaLabel={t("public.hero.ctaChat")} />
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: "💡", text: t("public.why.one") },
            { icon: "🔎", text: t("public.why.two") },
            { icon: "🧠", text: t("public.why.three") },
            { icon: "🌍", text: t("public.why.four") },
          ].map((it) => (
            <SectionCard key={it.text} className="fade-in-up p-4">
              <div className="text-sm font-medium text-gray-800">
                <span className="mr-2 select-none">{it.icon}</span>
                {it.text}
              </div>
            </SectionCard>
          ))}
        </div>
      </section>

      <Ticker
        ariaLabel="Exemples de questions"
        items={[
          t("public.themes.surveillance.example"),
          t("public.themes.ai.example"),
          t("public.themes.environment.example"),
          t("public.themes.education.example"),
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card-future rounded-xl border border-gray-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t("public.hero.title")}</h2>
          <p className="mt-2 text-gray-600">{t("public.hero.subtitle")}</p>
          <div className="mt-4">
            <TrackedLink href="/chat" event="cta_chat_agent_block" className="cta-futuriste rounded-md px-4 py-2 text-sm font-semibold">
              {t("public.hero.ctaExplore")}
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <SectionHeader as="h3" title={t("public.themes.title")} icon={<span>🌐</span>} className="text-sm" />
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
        <div className="mt-4">
          <Link href="/chat" className="text-sm font-medium text-gray-700 hover:underline">Voir tous les thèmes →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-sm font-semibold tracking-tight">{t("public.agent.title")}</div>
          <QuickAsk defaultValue={t("public.themes.ai.example")} placeholder={t("public.chat.placeholder")} ctaLabel={t("public.agent.ctaChat")} />
        </div>
      </section>
    </>
  )
}



