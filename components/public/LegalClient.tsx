"use client"

import { useLanguage } from "@/lib/language-context"
import { COMPANY, HOST } from "@/lib/site-config"

export function LegalClient() {
  const { language } = useLanguage()
  const companyName = COMPANY.name
  const companyForm = COMPANY.form
  const companySiret = COMPANY.siret
  const companyAddress = COMPANY.address
  const companyEmail = COMPANY.email
  const companyPhone = COMPANY.phone
  const directorName = COMPANY.director
  const hostName = HOST.name
  const hostAddress = HOST.address
  const hostWebsite = HOST.website
  const lastUpdate = new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")

  const T = language === "en" ? {
    title: "Legal Mentions / Terms",
    updated: "Last updated",
    publisher: {
      title: "Site Publisher",
      name: "Name",
      form: "Company form",
      siret: "SIRET",
      address: "Address",
      email: "Email",
      phone: "Phone",
      director: "Publication Director",
    },
    hosting: { title: "Hosting", host: "Host", address: "Address", website: "Website" },
    ip: { title: "Intellectual Property", p: `All content (texts, images, trademarks, logos, graphics and sounds) on this site is owned by ${companyName} or its partners and protected by applicable laws. Any reproduction or representation, in whole or in part, is prohibited without prior written authorization.` },
    terms: {
      title: "Terms of Use",
      items: [
        `The public demo service is provided "as is". ${companyName} does not guarantee the accuracy or completeness of the AI Assistant answers.`,
        "Users agree not to submit unlawful, defamatory, or third‑party protected content without authorization.",
        `In case of abuse, ${companyName} reserves the right to limit access to the service.`,
      ],
    },
    liability: { title: "Liability", p: `${companyName} shall not be liable for direct or indirect damages resulting from the use of the site or the information provided. Hyperlinks to third‑party sites are provided for information purposes.` },
    privacy: { title: "Personal Data", p: `Data collection and processing are described in the Privacy Policy. To exercise your rights (access, rectification, erasure, objection), contact us at ` },
    law: { title: "Applicable Law", p: "This site is governed by French law. In case of dispute, the competent courts shall be those of the publisher’s jurisdiction." },
  } : {
    title: "Mentions Légales / CGU",
    updated: "Dernière mise à jour",
    publisher: {
      title: "Éditeur du site",
      name: "Nom",
      form: "Forme",
      siret: "SIRET",
      address: "Adresse",
      email: "Email",
      phone: "Téléphone",
      director: "Directeur de la publication",
    },
    hosting: { title: "Hébergement", host: "Hébergeur", address: "Adresse", website: "Site web" },
    ip: { title: "Propriété intellectuelle", p: `L’ensemble des contenus (textes, images, marques, logos, éléments graphiques et sonores) présents sur le site sont la propriété de ${companyName} ou de ses partenaires, et sont protégés par le droit d’auteur et les lois en vigueur. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation écrite préalable.` },
    terms: {
      title: "Conditions d’utilisation",
      items: [
        `Le service public de démonstration est fourni « en l’état ». ${companyName} ne garantit pas l’exactitude ou l’exhaustivité des réponses générées par l’Agent IA.`,
        "L’utilisateur s’engage à ne pas soumettre de contenus illicites, diffamatoires ou protégés par des droits de tiers sans autorisation.",
        `En cas d’abus, ${companyName} se réserve le droit de limiter l’accès au service.`,
      ],
    },
    liability: { title: "Responsabilité", p: `${companyName} ne pourra être tenue responsable des dommages directs ou indirects résultant de l’utilisation du site ou des informations fournies. Les liens hypertextes vers des sites tiers sont fournis à titre informatif.` },
    privacy: { title: "Données personnelles", p: `La collecte et le traitement des données sont décrits dans la Politique de Confidentialité. Pour exercer vos droits (accès, rectification, suppression, opposition), contactez‑nous à ` },
    law: { title: "Droit applicable", p: "Le présent site est régi par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort de l’éditeur." },
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{T.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{T.updated}: {lastUpdate}</p>

      <div className="mt-8 space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold">{T.publisher.title}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><span className="font-medium">{T.publisher.name} :</span> {companyName}</li>
            <li><span className="font-medium">{T.publisher.form} :</span> {companyForm}</li>
            <li><span className="font-medium">{T.publisher.siret} :</span> {companySiret}</li>
            <li><span className="font-medium">{T.publisher.address} :</span> {companyAddress}</li>
            <li><span className="font-medium">{T.publisher.email} :</span> <a className="underline" href={`mailto:${companyEmail}`}>{companyEmail}</a></li>
            <li><span className="font-medium">{T.publisher.phone} :</span> {companyPhone}</li>
            <li><span className="font-medium">{T.publisher.director} :</span> {directorName}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.hosting.title}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><span className="font-medium">{T.hosting.host} :</span> {hostName}</li>
            <li><span className="font-medium">{T.hosting.address} :</span> {hostAddress}</li>
            <li><span className="font-medium">{T.hosting.website} :</span> <a href={hostWebsite} target="_blank" rel="noreferrer noopener" className="underline">{hostWebsite}</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.ip.title}</h2>
          <p className="mt-3 text-sm">{T.ip.p}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.terms.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
            {T.terms.items.map((it) => (<li key={it}>{it}</li>))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.liability.title}</h2>
          <p className="mt-3 text-sm">{T.liability.p}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.privacy.title}</h2>
          <p className="mt-3 text-sm">{T.privacy.p}<a className="underline" href={`mailto:${companyEmail}`}>{companyEmail}</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{T.law.title}</h2>
          <p className="mt-3 text-sm">{T.law.p}</p>
        </section>
      </div>
    </section>
  )
}
