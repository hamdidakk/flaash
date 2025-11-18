"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { AnchorNav } from "@/components/public/ui/AnchorNav"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { FAQAccordion } from "@/components/public/blocks/FAQAccordion"
import { HeroSplit } from "@/components/public/blocks/HeroSplit"
import { ButtonCTA } from "@/components/public/ui/ButtonCTA"
import { SecondaryCTA } from "@/components/public/ui/SecondaryCTA"
import { PageSection } from "@/components/public/ui/PageSection"
import { ChatLink } from "@/components/public/ui/ChatLink"

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
    <PageSection className="public-guide" py="12">
      <HeroSplit
        className="public-guide__hero"
        containerClassName="public-guide__hero-container"
        heading={<span>{c.title}</span>}
        subtitle={<span className="public-guide__hero-subtitle">{c.intro}</span>}
        right={
          <SectionCard variant="surface" className="public-guide__hero-card" hover={false}>
            📘
          </SectionCard>
        }
      />

      <AnchorNav
        ariaLabel="Sommaire"
        items={[
          { href: "#citations", label: language === "fr" ? "D’où viennent les citations ?" : "Where do citations come from?" },
          { href: "#limites", label: language === "fr" ? "Limites de l’édition publique" : "Public edition limits" },
          { href: "#confidentialite", label: language === "fr" ? "Confidentialité & respect" : "Privacy & respect" },
        ]}
      />

      <div className="public-guide__sections">
        <SectionCard className="fade-in-up">
          <SectionHeader
            title={c.whatIs.title}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <p className="public-guide__paragraph">{c.whatIs.p1}</p>
        </SectionCard>

        <SectionCard className="fade-in-up">
          <SectionHeader
            title={c.howTo.title}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <ol className="public-guide__list">
            {c.howTo.steps.map((s) => (
              <li key={s} className="public-guide__list-item">
                <span className="public-guide__list-icon">✅</span>
                <span>
                  {s.replace("/chat", "")}
                  <ChatLink href="/chat" className="public-guide__inline-link">
                    /chat
                  </ChatLink>
                </span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard id="citations" className="fade-in-up">
          <SectionHeader
            title={c.citations.title.replace("3)", "💬")}
            className="public-guide__section-header public-guide__section-header--blue"
          />
          <p className="public-guide__paragraph">
            {language === "fr"
              ? "Chez FLAASH, chaque réponse est fondée sur des sources vérifiées. Voici comment nous citons les contenus."
              : "At FLAASH every answer is grounded in vetted sources. Here is how we cite content."}
          </p>
          <p className="public-guide__paragraph">
            {c.citations.p1}{" "}
            <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="public-guide__inline-link">
              boutique
            </a>
            .
          </p>
        </SectionCard>

        <SectionCard id="limites" className="fade-in-up">
          <SectionHeader
            title={c.limits.title.replace("4)", "⚠")}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <p className="public-guide__paragraph">
            {language === "fr"
              ? "Nous voulons que chacun puisse tester librement : voici les limites de l’édition publique."
              : "We want everyone to experiment freely; here are the limits of the public edition."}
          </p>
          <ul className="public-guide__list">
            {c.limits.items.map((it) => (
              <li key={it} className="public-guide__list-item">
                <span className="public-guide__list-icon">🔒</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard id="conseils" className="fade-in-up">
          <SectionHeader
            title={c.tips.title.replace("5)", "💡")}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <ul className="public-guide__list">
            {c.tips.items.map((it) => (
              <li key={it} className="public-guide__list-item">
                <span className="public-guide__list-icon">✨</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard id="confidentialite" className="fade-in-up">
          <SectionHeader
            title={c.privacy.title.replace("6)", language === "fr" ? "🔒 Notre engagement : confidentialité et respect" : "🔒 Our commitment: privacy & respect")}
            className="public-guide__section-header public-guide__section-header--blue"
          />
          <p className="public-guide__paragraph">{c.privacy.p1}</p>
        </SectionCard>

        <SectionCard id="boutique" className="fade-in-up">
          <SectionHeader
            title={c.shop.title.replace("7)", language === "fr" ? "🛍 Acheter la revue" : "🛍 Buy the magazine")}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <p className="public-guide__paragraph">
            {c.shop.p1}{" "}
            <a href="https://boutique.flaash.fr" target="_blank" rel="noreferrer noopener" className="public-guide__inline-link">
              boutique
            </a>
            .
          </p>
          <p className="public-guide__paragraph">
            {language === "fr" ? "👉 Découvrez nos éditions complètes dans la boutique FLAASH." : "👉 Discover the full editions in the FLAASH shop."}
          </p>
        </SectionCard>

        <SectionCard id="faq" className="fade-in-up">
          <SectionHeader
            title={c.faq.title}
            className="public-guide__section-header public-guide__section-header--indigo"
          />
          <FAQAccordion items={c.faq.items} footerText="Vous avez une autre question ? Contactez-nous via le chat ou par mail 💌." />
        </SectionCard>

        <div className="public-guide__cta-group">
          <ButtonCTA href="/chat" icon={<span aria-hidden className="public-guide__cta-icon">🤖</span>} className="public-guide__cta-primary">
            {c.ctas.chat}
          </ButtonCTA>
          <SecondaryCTA
            href="https://boutique.flaash.fr"
            external
            event="guide_shop_cta"
            icon={<span aria-hidden className="public-guide__cta-icon">🛒</span>}
            className="public-guide__cta-secondary"
          >
            {c.ctas.shop}
          </SecondaryCTA>
        </div>
      </div>
    </PageSection>
  )
}
