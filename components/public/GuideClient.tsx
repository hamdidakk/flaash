"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { AnchorNav } from "@/components/public/ui/AnchorNav"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { FAQAccordion } from "@/components/public/blocks/FAQAccordion"

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
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
      <p className="mt-2 text-gray-600 leading-relaxed">{c.intro}</p>

      <AnchorNav
        ariaLabel="Sommaire"
        items={[
          { href: "#citations", label: "D’où viennent les citations ?" },
          { href: "#limites", label: "Limites de l’édition publique" },
          { href: "#confidentialite", label: "Confidentialité & respect" },
        ]}
      />

      <div className="mt-8 grid gap-6">
        <SectionCard className="fade-in-up">
          <SectionHeader title={c.whatIs.title} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <p className="mt-2 text-gray-600 leading-relaxed">{c.whatIs.p1}</p>
        </SectionCard>

        <SectionCard className="fade-in-up">
          <SectionHeader title={c.howTo.title} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <ol className="mt-2 space-y-2 text-gray-700 leading-relaxed">
            {c.howTo.steps.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1 select-none">✅</span>
                <span>{s.replace("/chat", "")}<Link href="/chat" className="underline">/chat</Link>{s.endsWith(".") ? "" : ""}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard id="citations" className="fade-in-up">
          <SectionHeader title={c.citations.title.replace("3)", "💬")} className="!bg-transparent !px-0 !py-0 text-blue-600" />
          <p className="mt-2 text-gray-600 leading-relaxed">Chez FLAASH, chaque réponse est fondée sur des sources vérifiées. Voici comment nous citons les contenus.</p>
          <p className="mt-2 text-gray-700 leading-relaxed">{c.citations.p1} <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="underline">boutique</a>.</p>
        </SectionCard>

        <SectionCard id="limites" className="fade-in-up">
          <SectionHeader title={c.limits.title.replace("4)", "⚠")} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <p className="mt-2 text-gray-600 leading-relaxed">Nous voulons que chacun puisse tester librement : voici les limites de l’édition publique.</p>
          <ul className="mt-2 space-y-2 text-gray-700 leading-relaxed">
            {c.limits.items.map((it) => (
              <li key={it} className="flex items-start gap-2"><span className="mt-1 select-none">🔒</span><span>{it}</span></li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard id="conseils" className="fade-in-up">
          <SectionHeader title={c.tips.title.replace("5)", "💡")} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <ul className="mt-2 space-y-2 text-gray-700 leading-relaxed">
            {c.tips.items.map((it) => (
              <li key={it} className="flex items-start gap-2"><span className="mt-1 select-none">✨</span><span>{it}</span></li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard id="confidentialite" className="fade-in-up">
          <SectionHeader title={c.privacy.title.replace("6)", "🔒 Notre engagement : confidentialité et respect")} className="!bg-transparent !px-0 !py-0 text-blue-600" />
          <p className="mt-2 text-gray-600 leading-relaxed">{c.privacy.p1}</p>
        </SectionCard>

        <SectionCard id="boutique" className="fade-in-up">
          <SectionHeader title={c.shop.title.replace("7)", "🛍 Acheter la revue")} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <p className="mt-2 text-gray-700 leading-relaxed">{c.shop.p1} <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="underline">boutique</a>.</p>
          <p className="mt-2 text-gray-700 leading-relaxed">👉 Découvrez nos éditions complètes dans la boutique FLAASH.</p>
        </SectionCard>

        <SectionCard id="faq" className="fade-in-up">
          <SectionHeader title={c.faq.title} className="!bg-transparent !px-0 !py-0 text-indigo-600" />
          <FAQAccordion items={c.faq.items} footerText="Vous avez une autre question ? Contactez-nous via le chat ou par mail 💌." />
        </SectionCard>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:w-fit">
          <Link href="/chat" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105">
            🤖 <span className="ml-2">{c.ctas.chat}</span>
          </Link>
          <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-900 transition-transform hover:scale-105">
            🛒 <span className="ml-2">{c.ctas.shop}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
