"use client"

import { PublicHeader } from "@/components/public/PublicHeader"
import { PublicFooter } from "@/components/public/PublicFooter"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/i18n"

export default function AboutPage() {
  const { t, language } = useLanguage()
  const items: string[] = (translations as any)?.[language]?.public?.about?.what?.items ?? []
  return (
    <main style={{ paddingBottom: "var(--public-footer-height, 96px)" }}>
      <PublicHeader />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{t("public.about.title")}</h1>
        <p className="mt-3 text-gray-600">{t("public.about.p1")}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold">{t("public.about.mission.title")}</h2>
            <p className="mt-2 text-sm text-gray-600">{t("public.about.mission.p")}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold">{t("public.about.approach.title")}</h2>
            <p className="mt-2 text-sm text-gray-600">{t("public.about.approach.p")}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold">{t("public.about.agent.title")}</h2>
            <p className="mt-2 text-sm text-gray-600">{t("public.about.agent.p")}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">{t("public.about.what.title")}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">{t("public.about.team.title")}</h3>
            <p className="mt-3 text-sm text-gray-700">{t("public.about.team.p")}</p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold">{t("public.about.history.title")}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">{t("public.about.history.a.y")}</div>
              <p className="text-sm text-gray-600">{t("public.about.history.a.p")}</p>
            </div>
            <div>
              <div className="text-sm font-medium">{t("public.about.history.b.y")}</div>
              <p className="text-sm text-gray-600">{t("public.about.history.b.p")}</p>
            </div>
            <div>
              <div className="text-sm font-medium">{t("public.about.history.c.y")}</div>
              <p className="text-sm text-gray-600">{t("public.about.history.c.p")}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a href="/chat" className="cta-futuriste rounded-md px-4 py-2 text-sm font-medium">{t("public.about.ctas.chat")}</a>
          <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="cta-futuriste rounded-md px-4 py-2 text-sm font-medium">{t("public.about.ctas.shop")}</a>
          <a href="/guide" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">{t("public.about.ctas.guide")}</a>
        </div>
      </section>
      <PublicFooter />
    </main>
  )
}


