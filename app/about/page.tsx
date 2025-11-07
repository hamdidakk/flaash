"use client"

import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { AnchorNav } from "@/components/public/ui/AnchorNav"
import { Timeline } from "@/components/public/blocks/Timeline"

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
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{t("public.about.title")}</h1>
        <p className="mt-3 max-w-3xl text-base text-gray-700">{t("public.about.p1")}</p>

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

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard className="fade-in-up md:col-span-2">
            <SectionHeader title={t("public.about.mission.title")} icon={<span>🧭</span>} />
            <p className="mt-3 text-sm text-gray-700">{t("public.about.mission.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.approach.title")} icon={<span>🧠</span>} />
            <p className="mt-3 text-sm text-gray-700">{t("public.about.approach.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up md:col-span-2">
            <SectionHeader title={t("public.about.agent.title")} icon={<span>🤖</span>} />
            <p className="mt-3 text-sm text-gray-700">{t("public.about.agent.p")}</p>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.what.title")} icon={<span>✍️</span>} />
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-800">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard className="fade-in-up">
            <SectionHeader title={t("public.about.team.title")} icon={<span>👥</span>} />
            <p className="mt-3 text-sm text-gray-700">{t("public.about.team.p")}</p>
          </SectionCard>
        </div>

        <SectionCard>
          <section id="histoire" className="fade-in-up">
            <SectionHeader as="h3" title={t("public.about.history.title")} icon={<span>⏳</span>} />
            <Timeline
              items={[
                { label: `${t("public.about.history.a.y")}`, description: t("public.about.history.a.p"), icon: <span>🧪</span> },
                { label: `${t("public.about.history.b.y")}`, description: t("public.about.history.b.p"), icon: <span>📚</span> },
                { label: `${t("public.about.history.c.y")}`, description: t("public.about.history.c.p"), icon: <span>🚀</span> },
              ]}
            />
          </section>
        </SectionCard>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat" className="group cta-futuriste btn-pulse inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white hover:translate-y-[-1px]">
            <span aria-hidden>🤖</span>
            <span className="ml-2">{t("public.about.ctas.chat")}</span>
          </Link>
          <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50">
            <span aria-hidden>🛒</span>
            <span className="ml-2">{t("public.about.ctas.shop")}</span>
          </a>
          <Link href="/guide" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
            <span aria-hidden>📘</span>
            <span className="ml-2">{t("public.about.ctas.guide")}</span>
          </Link>
        </div>

        {showTop && (
          <button
            type="button"
            aria-label="Revenir en haut"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-4 inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-700 shadow-md ring-1 ring-gray-200 hover:shadow-lg"
          >
            ↑
          </button>
        )}
      </section>
      <PublicFooter />
    </main>
  )
}


