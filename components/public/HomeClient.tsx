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
            <div className="mt-6 flex gap-3">
              <ButtonCTA href="/chat" className="group" icon={<span>🤖</span>}>
                {t("public.hero.ctaChat")}
              </ButtonCTA>
              <TrackedLink
                href="https://boutique.flaash.fr"
                external
                event="cta_boutique_hero"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                <span aria-hidden>📰</span>
                <span className="ml-2">{t("public.hero.ctaShop")}</span>
              </TrackedLink>
            </div>
          </div>
          <SectionCard className="shadow-[0_0_60px_-20px_rgba(138,46,255,0.45)] ring-1 ring-cyan-400/10 transition-transform hover:translate-y-1">
            <div className="relative w-full overflow-hidden rounded-md h-48 sm:h-64 md:h-80 lg:h-96">
              <Image src={coverUrl} alt="Illustration conversation IA" fill className="object-contain p-2" sizes="(min-width: 1024px) 520px, (min-width: 768px) 420px, 100vw" priority />
            </div>
            <div className="mt-4">
              <div className="inline-flex max-w-[90%] items-start gap-2 rounded-md border border-gray-200 bg-white/70 p-3 text-sm text-gray-700 shadow-sm backdrop-blur">
                <span aria-hidden>✨</span>
                <p>
                  Bonjour, explorateur du futur 👋 Posez-moi une question sur la science-fiction ou les technologies émergentes.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[{icon:"💡",text:"Pourquoi FLAASH ?"},{icon:"🔎",text:"Sources vérifiées, IA entraînée sur nos publications"},{icon:"🧠",text:"Analyses croisées entre science et fiction"},{icon:"🌍",text:"Un regard éditorial sur les futurs possibles"}].map((it)=> (
            <SectionCard key={it.text} className="fade-in-up p-4">
              <div className="text-sm font-medium text-gray-800"><span className="mr-2 select-none">{it.icon}</span>{it.text}</div>
            </SectionCard>
          ))}
        </div>
      </section>

      <Ticker
        ariaLabel="Exemples de questions"
        items={[
          "Quels romans parlent de sociétés sous surveillance ?",
          "Comment l’IA change-t-elle la justice ?",
          "Quelles œuvres anticipent les crises climatiques ?",
          "Quelles technologies émergentes vont transformer nos villes ?",
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card-future rounded-xl border border-gray-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight">Le futur, expliqué par FLAASH</h2>
          <p className="mt-2 text-gray-600">
            Flaash explore les futurs possibles à travers la science-fiction et la prospective. Discutez avec notre Agent IA, formé sur nos publications, pour découvrir des idées, des récits et des perspectives inédites sur demain.
          </p>
          <div className="mt-4">
            <TrackedLink href="/chat" event="cta_chat_agent_block" className="cta-futuriste rounded-md px-4 py-2 text-sm font-semibold">
              Explorer avec l’IA
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <SectionHeader as="h3" title="Explorer les thèmes de demain" icon={<span>🌐</span>} className="text-sm" />
        <ThemeGrid
          themes={[
            { icon: "🤖", title: "IA & société", prompts: ["Comment l’IA change-t-elle la justice ?", "Quelles professions seront transformées par l’IA ?"] },
            { icon: "🌍", title: "Crises & résilience", prompts: ["Quelles œuvres anticipent les crises climatiques ?", "Comment des villes s’adaptent aux pénuries ?"] },
            { icon: "⚙️", title: "Technologies émergentes", prompts: ["Quelles technologies vont transformer nos villes ?", "Qu’apportent les biotechs à la santé ?"] },
            { icon: "🎭", title: "Design fiction", prompts: ["Quels romans parlent de sociétés sous surveillance ?", "Comment imaginer des futurs souhaitables ?"] },
          ]}
        />
        <div className="mt-4">
          <Link href="/chat" className="text-sm font-medium text-gray-700 hover:underline">Voir tous les thèmes →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-sm font-semibold tracking-tight">Posez votre première question à l’IA</div>
          <QuickAsk />
        </div>
      </section>
    </>
  )
}



