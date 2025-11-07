"use client"

import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"
import Link from "next/link"
import { useEffect, useState } from "react"

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
    <main style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{t("public.about.title")}</h1>
        <p className="mt-3 max-w-3xl text-base text-gray-700">{t("public.about.p1")}</p>

        <nav className="mt-6 flex flex-wrap items-center justify-start gap-3 text-sm" aria-label={language === "fr" ? "Sommaire" : "Table of contents"}>
          {[
            { href: "#mission", label: t("public.about.mission.title") },
            { href: "#approche", label: t("public.about.approach.title") },
            { href: "#publications", label: t("public.about.what.title") },
            { href: "#equipe", label: t("public.about.team.title") },
            { href: "#agent", label: t("public.about.agent.title") },
            { href: "#histoire", label: t("public.about.history.title") },
          ].map((l) => (
            <a key={l.href} href={l.href} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <section id="mission" className="fade-in-up rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg md:col-span-2">
            <h2 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">🧭 {t("public.about.mission.title")}</h2>
            <p className="mt-3 text-sm text-gray-700">{t("public.about.mission.p")}</p>
          </section>
          <section id="approche" className="fade-in-up rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">🧠 {t("public.about.approach.title")}</h2>
            <p className="mt-3 text-sm text-gray-700">{t("public.about.approach.p")}</p>
          </section>
          <section id="agent" className="fade-in-up rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg md:col-span-2">
            <h2 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">🤖 {t("public.about.agent.title")}</h2>
            <p className="mt-3 text-sm text-gray-700">{t("public.about.agent.p")}</p>
          </section>
          <section id="publications" className="fade-in-up rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">✍️ {t("public.about.what.title")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-800">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>
          <section id="equipe" className="fade-in-up rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">👥 {t("public.about.team.title")}</h2>
            <p className="mt-3 text-sm text-gray-700">{t("public.about.team.p")}</p>
          </section>
        </div>

        <section id="histoire" className="fade-in-up mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">
          <h3 className="inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800">⏳ {t("public.about.history.title")}</h3>
          <div className="relative mt-6 overflow-x-auto">
            <ol className="relative mx-auto flex min-w-[560px] items-start gap-8 border-l-2 border-cyan-200 pl-6 md:min-w-0 md:border-l-0 md:pl-0 md:[&>li]:flex-1 md:[&>li]:border-t-2 md:[&>li]:border-cyan-200 md:[&>li]:pt-4">
              <li className="md:pl-4">
                <div className="text-sm font-semibold text-slate-800">{t("public.about.history.a.y")} 🧪</div>
                <p className="text-sm text-gray-700">{t("public.about.history.a.p")}</p>
              </li>
              <li className="md:pl-4">
                <div className="text-sm font-semibold text-slate-800">{t("public.about.history.b.y")} 📚</div>
                <p className="text-sm text-gray-700">{t("public.about.history.b.p")}</p>
              </li>
              <li className="md:pl-4">
                <div className="text-sm font-semibold text-slate-800">{t("public.about.history.c.y")} 🚀</div>
                <p className="text-sm text-gray-700">{t("public.about.history.c.p")}</p>
              </li>
            </ol>
          </div>
        </section>

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


