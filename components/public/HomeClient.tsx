"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { PageView } from "@/components/public/PageView"

export function HomeClient({ coverUrl }: { coverUrl: string }) {
  const { t } = useLanguage()
  return (
    <>
      <PageView page="home" />

      <section className="relative bg-gradient-to-b from-white to-gray-50 hero-future">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
          <div className="fade-in-up">
            <h1 className="display-title text-3xl tracking-tight md:text-4xl">{t("public.hero.title")}</h1>
            <p className="mt-3 text-gray-600">{t("public.hero.subtitle")}</p>
            <div className="mt-6 flex gap-3">
              <TrackedLink
                href="https://boutique.flaash.fr"
                external
                event="cta_boutique_hero"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                {t("public.hero.ctaShop")}
              </TrackedLink>
              <TrackedLink
                href="/chat"
                event="cta_chat_hero"
                className="cta-futuriste btn-pulse rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                <span aria-hidden>🤖</span>
                <span className="ml-2">{t("public.hero.ctaChat")}</span>
              </TrackedLink>
            </div>
          </div>
          <div className="card-future rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="relative w-full overflow-hidden rounded-md h-48 sm:h-64 md:h-80 lg:h-96">
              <Image src={coverUrl} alt="Illustration conversation IA" fill className="object-contain p-2" sizes="(min-width: 1024px) 520px, (min-width: 768px) 420px, 100vw" priority />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-2/3 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card-future rounded-xl border border-gray-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t("public.agent.title")}</h2>
          <p className="mt-2 text-gray-600">{t("public.agent.subtitle")}</p>
          <div className="mt-4">
            <TrackedLink href="/chat" event="cta_chat_agent_block" className="cta-futuriste rounded-md px-4 py-2 text-sm font-medium">
              {t("public.agent.ctaChat")}
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h3 className="text-base font-semibold tracking-tight">{t("public.themes.title")}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: t("public.themes.surveillance.title"), examples: [t("public.themes.surveillance.example")] },
            { title: t("public.themes.ai.title"), examples: [t("public.themes.ai.example")] },
            { title: t("public.themes.shortages.title"), examples: [t("public.themes.shortages.example")] },
            { title: t("public.themes.education.title"), examples: [t("public.themes.education.example")] },
            { title: t("public.themes.health.title"), examples: [t("public.themes.health.example")] },
            { title: t("public.themes.environment.title"), examples: [t("public.themes.environment.example")] },
          ].map((it) => (
            <div key={it.title} className="card-future rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm font-medium">{it.title}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {it.examples.map((ex) => (
                  <li key={ex}>
                    <Link href={`/chat?prefill=${encodeURIComponent(ex)}`} className="hover:underline text-gray-700">
                      {ex}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}


