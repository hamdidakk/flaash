"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { PageView } from "@/components/public/PageView"
import { useState } from "react"

export function HomeClient({ coverUrl }: { coverUrl: string }) {
  const { t } = useLanguage()
  return (
    <>
      <PageView page="home" />

      <section className="relative bg-gradient-to-b from-white to-gray-50 hero-future">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.06] [background:radial-gradient(circle_at_30%_20%,#141A2A_0%,#0A0C14_70%)]" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
          <div className="fade-in-up">
            <h1 className="display-title text-3xl tracking-tight md:text-4xl">🔮 Le futur, expliqué par FLAASH</h1>
            <p className="mt-2 text-gray-600">Découvrez les futurs possibles à travers la science, la fiction et l’IA.</p>
            <p className="mt-1 text-sm italic text-gray-500">Une exploration des futurs possibles à travers l’IA, la science et la fiction.</p>
            <div className="mt-6 flex gap-3">
              <TrackedLink
                href="/chat"
                event="cta_chat_hero"
                className="group inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                <span aria-hidden>🤖</span>
                <span className="ml-2">Interroger l’Agent IA</span>
              </TrackedLink>
              <TrackedLink
                href="https://boutique.flaash.fr"
                external
                event="cta_boutique_hero"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                <span aria-hidden>📰</span>
                <span className="ml-2">Découvrir la revue complète</span>
              </TrackedLink>
            </div>
          </div>
          <div className="card-future rounded-lg border border-gray-200 bg-white p-6 shadow-sm shadow-[0_0_60px_-20px_rgba(138,46,255,0.45)] ring-1 ring-cyan-400/10 transition-transform hover:translate-y-1 hover:shadow-lg">
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
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[{icon:"💡",text:"Pourquoi FLAASH ?"},{icon:"🔎",text:"Sources vérifiées, IA entraînée sur nos publications"},{icon:"🧠",text:"Analyses croisées entre science et fiction"},{icon:"🌍",text:"Un regard éditorial sur les futurs possibles"}].map((it)=> (
            <div key={it.text} className="fade-in-up rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="text-sm font-medium text-gray-800"><span className="mr-2 select-none">{it.icon}</span>{it.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Exemples de questions" className="relative border-y border-gray-100 bg-white/60">
        <div className="ticker mx-auto max-w-6xl overflow-hidden px-4 py-3">
          <div className="ticker__track inline-block whitespace-nowrap">
            {[
              "Quels romans parlent de sociétés sous surveillance ?",
              "Comment l’IA change-t-elle la justice ?",
              "Quelles œuvres anticipent les crises climatiques ?",
              "Quelles technologies émergentes vont transformer nos villes ?",
            ]
              .concat([
                "Quels romans parlent de sociétés sous surveillance ?",
                "Comment l’IA change-t-elle la justice ?",
                "Quelles œuvres anticipent les crises climatiques ?",
                "Quelles technologies émergentes vont transformer nos villes ?",
              ])
              .map((q, i) => (
                <span key={i} className="mr-8 inline-flex items-center text-sm text-gray-700">
                  <span className="mr-2 text-gray-400">✦</span>
                  {q}
                </span>
              ))}
          </div>
        </div>
      </section>

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
        <h3 className="text-base font-semibold tracking-tight">🌐 Explorer les thèmes de demain</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              icon: "🤖",
              title: "IA & société",
              prompts: [
                "Comment l’IA change-t-elle la justice ?",
                "Quelles professions seront transformées par l’IA ?",
              ],
            },
            {
              icon: "🌍",
              title: "Crises & résilience",
              prompts: [
                "Quelles œuvres anticipent les crises climatiques ?",
                "Comment des villes s’adaptent aux pénuries ?",
              ],
            },
            {
              icon: "⚙️",
              title: "Technologies émergentes",
              prompts: [
                "Quelles technologies vont transformer nos villes ?",
                "Qu’apportent les biotechs à la santé ?",
              ],
            },
            {
              icon: "🎭",
              title: "Design fiction",
              prompts: [
                "Quels romans parlent de sociétés sous surveillance ?",
                "Comment imaginer des futurs souhaitables ?",
              ],
            },
          ].map((theme) => (
            <div
              key={theme.title}
              className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md"
            >
              <div className="text-sm font-semibold tracking-tight">
                <span className="mr-2 select-none">{theme.icon}</span>
                {theme.title}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {theme.prompts.map((ex) => (
                  <li key={ex}>
                    <Link href={`/chat?prefill=${encodeURIComponent(ex)}`} className="hover:underline">
                      {ex}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/chat" className="text-sm font-medium text-gray-700 hover:underline">Voir tous les thèmes →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-sm font-semibold tracking-tight">Posez votre première question à l’IA</div>
          <HomeQuickAsk />
        </div>
      </section>
    </>
  )
}


function HomeQuickAsk() {
  const [query, setQuery] = useState("Quelles technologies vont changer nos villes ?")
  return (
    <form
      className="mt-3 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault()
        if (typeof window !== "undefined") {
          window.location.href = `/chat?prefill=${encodeURIComponent(query)}`
        }
      }}
    >
      <label htmlFor="quick-ask" className="sr-only">Votre question</label>
      <input
        id="quick-ask"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        placeholder="Posez une question..."
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Interroger l’Agent IA
      </button>
    </form>
  )
}


