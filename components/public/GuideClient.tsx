"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

type GuideContent = {
  title: string
  intro: string
  whatIs: { title: string; p1: string }
  howTo: { title: string; steps: string[] }
  citations: { title: string; p1: string }
  limits: { title: string; items: string[] }
  tips: { title: string; items: string[] }
  privacy: { title: string; p1: string }
  shop: { title: string; p1: string }
  faq: { title: string; items: { q: string; a: string }[] }
  ctas: { chat: string; shop: string }
}

const DEFAULTS: Record<"fr" | "en", GuideContent> = {
  fr: {
    title: "Guide d’utilisation",
    intro:
      "Bienvenue sur FLAASH. Cette page explique comment utiliser l’Agent IA public, sur quelles sources il s’appuie, et comment tirer le meilleur parti de votre expérience.",
    whatIs: {
      title: "1) C’est quoi l’Agent IA FLAASH ?",
      p1: "Un assistant conversationnel entraîné sur les contenus de FLAASH (numéros de la revue, articles spécialisés, analyses de prospective, etc.). Posez une question, il répond et affiche des citations pour assurer la transparence.",
    },
    howTo: {
      title: "2) Comment l’utiliser ?",
      steps: [
        "Rendez-vous sur /chat.",
        "Saisissez votre question (ou cliquez une suggestion) puis envoyez.",
        "Consultez la réponse et ses citations (cliquables) pour voir les extraits.",
      ],
    },
    citations: {
      title: "3) D’où viennent les citations ?",
      p1: "Chaque réponse s’appuie sur des contenus indexés. Les références affichées permettent d’ouvrir une modale ‘Source’ et de consulter des extraits. Quand un lien public est disponible, il est proposé ; sinon, vous pouvez visiter la boutique.",
    },
    limits: {
      title: "4) Limites de l’édition publique",
      items: [
        "Jusqu’à 3 requêtes gratuites par session anonyme (limite souple).",
        "Un court délai est requis entre 2 requêtes (anti-abus).",
        "Pour un accès étendu, connectez-vous via /admin ou consultez la boutique.",
      ],
    },
    tips: {
      title: "5) Conseils pour de meilleures réponses",
      items: [
        "Préférez des questions précises (‘Quel est l’impact… ?’ plutôt que ‘Parle-moi de…’).",
        "Indiquez le contexte (thème, période, type de document) pour affiner la recherche.",
        "Vérifiez systématiquement les citations pour comprendre l’origine de l’information.",
      ],
    },
    privacy: {
      title: "6) Confidentialité & respect",
      p1: "L’édition publique ne requiert pas de compte. Nous collectons des métriques anonymisées (pages vues, clics de CTA, envoi de question) afin d’améliorer l’expérience. Aucune donnée sensible n’est demandée ou stockée via l’édition publique.",
    },
    shop: {
      title: "7) Acheter la revue",
      p1: "Pour soutenir FLAASH et accéder aux contenus complets, visitez la boutique officielle.",
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Pourquoi je vois un message de limite ?", a: "Pour éviter les abus et préserver les ressources, nous limitons le nombre de requêtes anonymes." },
        { q: "Pourquoi certaines réponses manquent de détails ?", a: "L’IA privilégie des extraits disponibles. Pour des analyses complètes, référez-vous aux numéros FLAASH." },
        { q: "Puis-je citer FLAASH ?", a: "Oui, en mentionnant la source et le numéro. Les citations affichées facilitent cette démarche." },
      ],
    },
    ctas: { chat: "Parler à l’IA", shop: "Aller à la boutique" },
  },
  en: {
    title: "User Guide",
    intro:
      "Welcome to FLAASH. This page explains how to use the public AI Agent, which sources it relies on, and how to get the best out of it.",
    whatIs: {
      title: "1) What is the FLAASH AI Agent?",
      p1: "A conversational assistant trained on FLAASH content (issues of the magazine, specialized articles, foresight analyses, etc.). Ask a question, it answers and shows citations for transparency.",
    },
    howTo: {
      title: "2) How to use it?",
      steps: [
        "Go to /chat.",
        "Type your question (or click a suggestion) then send.",
        "Read the answer and its citations (clickable) to view excerpts.",
      ],
    },
    citations: {
      title: "3) Where do citations come from?",
      p1: "Each answer relies on indexed content. The displayed references open a ‘Source’ modal to read excerpts. When a public link is available, it’s proposed; otherwise, you can visit the shop.",
    },
    limits: {
      title: "4) Public edition limits",
      items: [
        "Up to 3 free requests per anonymous session (soft limit).",
        "A short delay is required between 2 requests (anti‑abuse).",
        "For extended access, sign in via /admin or visit the shop.",
      ],
    },
    tips: {
      title: "5) Tips for better answers",
      items: [
        "Prefer precise questions (‘What is the impact…?’ rather than ‘Tell me about…’).",
        "Provide context (theme, period, document type) to refine the search.",
        "Always verify citations to understand the information’s origin.",
      ],
    },
    privacy: {
      title: "6) Privacy & respect",
      p1: "The public edition does not require an account. We collect anonymized usage metrics (page views, CTA clicks, question sends) to improve the experience. No sensitive data is asked or stored by the public edition.",
    },
    shop: { title: "7) Buy the magazine", p1: "Support FLAASH and access full content: visit the official shop." },
    faq: {
      title: "FAQ",
      items: [
        { q: "Why do I see a limit message?", a: "To prevent abuse and preserve resources, we limit anonymous requests." },
        { q: "Why are some answers short on detail?", a: "The AI prioritizes available excerpts. For full analyses, refer to FLAASH issues." },
        { q: "Can I quote FLAASH?", a: "Yes, by mentioning the source and issue. The displayed citations make this easy." },
      ],
    },
    ctas: { chat: "Talk to the AI", shop: "Go to the shop" },
  },
}

export function GuideClient() {
  const { language } = useLanguage()
  const c = DEFAULTS[language]
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>
      <p className="mt-2 text-gray-600">{c.intro}</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">{c.whatIs.title}</h2>
          <p className="mt-2 text-gray-700">{c.whatIs.p1}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.howTo.title}</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-6 text-gray-700">
            {c.howTo.steps.map((s) => (
              <li key={s}>{s.replace("/chat", "")}<Link href="/chat" className="underline">/chat</Link>{s.endsWith(".") ? "" : ""}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.citations.title}</h2>
          <p className="mt-2 text-gray-700">{c.citations.p1} <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="underline">boutique</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.limits.title}</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-gray-700">
            {c.limits.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.tips.title}</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-gray-700">
            {c.tips.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.privacy.title}</h2>
          <p className="mt-2 text-gray-700">{c.privacy.p1}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.shop.title}</h2>
          <p className="mt-2 text-gray-700">{c.shop.p1} {" "}
            <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="underline">boutique</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{c.faq.title}</h2>
          <div className="mt-2 space-y-3 text-gray-700">
            {c.faq.items.map((f) => (
              <details key={f.q}>
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 flex gap-3">
          <Link href="/chat" className="cta-futuriste rounded-md px-4 py-2 text-sm font-medium">{c.ctas.chat}</Link>
          <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="cta-futuriste rounded-md px-4 py-2 text-sm font-medium">{c.ctas.shop}</a>
        </div>
      </div>
    </section>
  )
}
