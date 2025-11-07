"use client"

import { useLanguage } from "@/lib/language-context"
import { COMPANY } from "@/lib/site-config"
import Link from "next/link"

export function PrivacyClient() {
  const { language } = useLanguage()
  const companyEmail = COMPANY.email
  const lastUpdate = new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")

  const T = language === "en" ? {
    title: "Privacy Policy",
    subtitle: "Learn how we protect your data and privacy.",
    updated: "Last updated",
    sections: [
      {
        title: "1) What data is collected?",
        items: [
          "Anonymized usage data (page views, CTA clicks, question sends).",
          "Technical information (User-Agent, URL, timestamp) for security and improvement purposes.",
          "No sensitive data is required for the public edition.",
        ],
      },
      {
        title: "2) Purposes and legal basis",
        items: [
          "Measuring and improving user experience (legitimate interest).",
          "Abuse prevention (rate‑limit, anti‑spam) and service security (legitimate interest).",
        ],
      },
      {
        title: "3) How long do we keep your data?",
        p: "Technical logs and usage metrics are kept for a period proportionate to the need (max. 13 months for audience measurement).",
      },
      {
        title: "4) Recipients and transfers",
        p: "Data is processed by the publisher and its hosting/maintenance providers. No transfers outside the EU are made without adequate safeguards.",
      },
      {
        title: "5) Cookies and Trackers",
        p: "The site may use strictly necessary cookies and anonymized audience measurement trackers. You can configure your browser to refuse them.",
      },
      {
        title: "6) Your Rights",
        p: "In accordance with GDPR, you have rights of access, rectification, erasure, objection and restriction. To exercise your rights: ",
      },
      {
        title: "7) Security",
        p: "We implement reasonable technical and organizational measures to protect your data against unauthorized access, disclosure, alteration or destruction.",
      },
    ],
  } : {
    title: "Politique de Confidentialité",
    subtitle: "Découvrez comment nous protégeons vos données et votre vie privée.",
    updated: "Dernière mise à jour",
    sections: [
      {
        title: "1) Quelles données sont collectées ?",
        items: [
          "Données d’usage anonymisées (pages vues, clics de CTA, envoi de question).",
          "Informations techniques (User-Agent, URL, horodatage) à des fins de sécurité et d’amélioration.",
          "Aucune donnée sensible n’est requise pour l’édition publique.",
        ],
      },
      {
        title: "2) Finalités et base légale",
        items: [
          "Mesure et amélioration de l’expérience utilisateur (intérêt légitime).",
          "Prévention des abus (rate‑limit, anti-spam) et sécurité du service (intérêt légitime).",
        ],
      },
      {
        title: "3) Combien de temps gardons‑nous vos données ?",
        p: "Les journaux techniques et métriques d’usage sont conservés pour une durée proportionnée au besoin (max. 13 mois pour la mesure d’audience).",
      },
      {
        title: "4) Destinataires et transferts",
        p: "Les données sont traitées par l’éditeur et ses prestataires d’hébergement/maintenance. Aucun transfert hors UE n’est réalisé sans garanties adéquates.",
      },
      {
        title: "5) Cookies et traceurs",
        p: "Le site peut utiliser des cookies strictement nécessaires au fonctionnement et des traceurs de mesure d’audience anonymisés. Vous pouvez configurer votre navigateur pour les refuser.",
      },
      {
        title: "6) Vos droits",
        p: "Conformément au RGPD, vous disposez de droits d’accès, de rectification, d’effacement, d’opposition et de limitation. Pour exercer vos droits : ",
      },
      {
        title: "7) Comment vos données sont‑elles protégées ?",
        p: "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre l’accès non autorisé, la divulgation, l’altération ou la destruction.",
      },
    ],
  }

  const icons = ["🔍", "🎯", "⏱", "📤", "🍪", "🧑‍⚖️", "🔐"]

  function highlight(text: string) {
    const map = language === "en"
      ? ["No sensitive data", "legitimate interest", "13 months", "GDPR"]
      : ["Aucune donnée sensible", "intérêt légitime", "13 mois", "RGPD"]
    return map.reduce((acc, key) => acc.replace(new RegExp(key, "gi"), (m) => `**${m}**`), text)
  }

  function renderWithStrong(str: string) {
    const parts = highlight(str).split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) => (
      p.startsWith("**") ? <strong key={i}>{p.replaceAll("**", "")}</strong> : <span key={i}>{p}</span>
    ))
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">🔒 {T.title}</h1>
          <p className="mt-1 text-gray-600">{T.subtitle}</p>
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700 ring-1 ring-green-200">{language === "fr" ? "Conforme RGPD" : "GDPR compliant"}</span>
            <span>•</span>
            <span>{T.updated}: {lastUpdate}</span>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label={language === "fr" ? "Sommaire" : "Table of contents"}>
        {T.sections.map((s, idx) => (
          <a key={s.title} href={`#s${idx+1}`} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50">
            {idx+1}️⃣ {s.title.replace(/^\d+\)\s*/, "")}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-6 text-gray-700">
        {T.sections.map((s, idx) => (
          <section key={s.title} id={`s${idx+1}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800"><span className="mr-2 select-none">{icons[idx] ?? ""}</span>{s.title}</h2>
            {s.items && (
              <ul className="mt-3 space-y-2 text-sm">
                {s.items.map((it: string) => (
                  <li key={it} className="flex items-start gap-2"><span className="mt-0.5 select-none">•</span><span>{renderWithStrong(it)}</span></li>
                ))}
              </ul>
            )}
            {s.p && (
              <p className="mt-3 text-sm leading-relaxed">
                {renderWithStrong(s.p)} {s.title.includes("Droits") || s.title.includes("Rights") ? (
                  <>
                    <span className="ml-1">{language === "fr" ? "Contact :" : "Contact:"}</span>
                    <a className="ml-1 rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700 underline decoration-blue-400" href={`mailto:${companyEmail}`}>{companyEmail}</a>.
                  </>
                ) : null}
              </p>
            )}
          </section>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-600">{language === "fr" ? "Notre engagement : aucune donnée n’est vendue, partagée ni utilisée à des fins publicitaires." : "Our commitment: no data is sold, shared, or used for advertising purposes."}</p>
    </section>
  )
}
