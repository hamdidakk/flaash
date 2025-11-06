"use client"

import { useLanguage } from "@/lib/language-context"
import { COMPANY } from "@/lib/site-config"

export function PrivacyClient() {
  const { language } = useLanguage()
  const companyEmail = COMPANY.email
  const lastUpdate = new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")

  const T = language === "en" ? {
    title: "Privacy Policy",
    updated: "Last updated",
    sections: [
      {
        title: "1) Data Collected",
        items: [
          "Anonymized usage data (page views, CTA clicks, question sends).",
          "Technical information (User-Agent, URL, timestamp) for security and improvement purposes.",
          "No sensitive data is required for the public edition.",
        ],
      },
      {
        title: "2) Purpose and Legal Basis",
        items: [
          "Measuring and improving user experience (legitimate interest).",
          "Abuse prevention (rate‑limit, anti‑spam) and service security (legitimate interest).",
        ],
      },
      {
        title: "3) Retention Periods",
        p: "Technical logs and usage metrics are kept for a period proportionate to the need (max. 13 months for audience measurement).",
      },
      {
        title: "4) Recipients and Transfers",
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
    updated: "Dernière mise à jour",
    sections: [
      {
        title: "1) Données collectées",
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
        title: "3) Durées de conservation",
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
        title: "7) Sécurité",
        p: "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre l’accès non autorisé, la divulgation, l’altération ou la destruction.",
      },
    ],
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{T.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{T.updated}: {lastUpdate}</p>

      <div className="mt-8 space-y-8 text-gray-700">
        {T.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.items && (
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                {s.items.map((it: string) => (<li key={it}>{it}</li>))}
              </ul>
            )}
            {s.p && (
              <p className="mt-3 text-sm">
                {s.p}
                {s.title.startsWith("6)") && (
                  <>
                    <a className="underline" href={`mailto:${companyEmail}`}>{companyEmail}</a>.
                  </>
                )}
              </p>
            )}
          </section>
        ))}
      </div>
    </section>
  )
}
