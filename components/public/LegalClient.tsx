"use client"

import { useLanguage } from "@/lib/language-context"
import { COMPANY, HOST } from "@/lib/site-config"
import { AnchorNav } from "@/components/public/ui/AnchorNav"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { ContactBadge } from "@/components/public/ui/ContactBadge"

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
      title: "Information about the site publisher",
      name: "Name",
      form: "Company form",
      siret: "SIRET",
      address: "Address",
      email: "Email",
      phone: "Phone",
      director: "Publication Director",
    },
    hosting: { title: "Hosting", host: "Host", address: "Address", website: "Website" },
    ip: { title: "Copyright and content", p: `All content (texts, images, trademarks, logos, graphics and sounds) on this site is owned by ${companyName} or its partners and protected by applicable laws. Any reproduction or representation, in whole or in part, is prohibited without prior written authorization.` },
    terms: {
      title: "Terms of use",
      items: [
        `The public demo service is provided "as is". ${companyName} does not guarantee the accuracy or completeness of the AI Assistant answers.`,
        "Users agree not to submit unlawful, defamatory, or third‑party protected content without authorization.",
        `In case of abuse, ${companyName} reserves the right to limit access to the service.`,
      ],
    },
    liability: { title: "Limitation of liability", p: `${companyName} shall not be liable for direct or indirect damages resulting from the use of the site or the information provided. Hyperlinks to third‑party sites are provided for information purposes.` },
    privacy: { title: "Personal data", p: `Data collection and processing are described in the Privacy Policy. To exercise your rights (access, rectification, erasure, objection), contact us at ` },
    law: { title: "Applicable Law", p: "This site is governed by French law. In case of dispute, the competent courts shall be those of the publisher’s jurisdiction." },
    intro: "Flaash is committed to offering a transparent service, compliant with applicable French laws.",
    toc: [
      "Publisher",
      "Hosting",
      "Copyright",
      "Terms",
      "Liability",
      "Personal data",
      "Applicable law",
    ],
    linkPrivacy: "See also our Privacy Policy",
    updateNote: "These legal notices may be changed at any time. Please check them regularly.",
  } : {
    title: "Mentions Légales / CGU",
    updated: "Dernière mise à jour",
    publisher: {
      title: "Informations sur l’éditeur du site",
      name: "Nom",
      form: "Forme",
      siret: "SIRET",
      address: "Adresse",
      email: "Email",
      phone: "Téléphone",
      director: "Directeur de la publication",
    },
    hosting: { title: "Hébergement", host: "Hébergeur", address: "Adresse", website: "Site web" },
    ip: { title: "Droits d’auteur et contenu", p: `L’ensemble des contenus (textes, images, marques, logos, éléments graphiques et sonores) présents sur le site sont la propriété de ${companyName} ou de ses partenaires, et sont protégés par le droit d’auteur et les lois en vigueur. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation écrite préalable.` },
    terms: {
      title: "Conditions d’utilisation",
      items: [
        `Le service public de démonstration est fourni « en l’état ». ${companyName} ne garantit pas l’exactitude ou l’exhaustivité des réponses générées par l’Agent IA.`,
        "L’utilisateur s’engage à ne pas soumettre de contenus illicites, diffamatoires ou protégés par des droits de tiers sans autorisation.",
        `En cas d’abus, ${companyName} se réserve le droit de limiter l’accès au service.`,
      ],
    },
    liability: { title: "Limite de responsabilité", p: `${companyName} ne pourra être tenue responsable des dommages directs ou indirects résultant de l’utilisation du site ou des informations fournies. Les liens hypertextes vers des sites tiers sont fournis à titre informatif.` },
    privacy: { title: "Données personnelles", p: `La collecte et le traitement des données sont décrits dans la Politique de Confidentialité. Pour exercer vos droits (accès, rectification, suppression, opposition), contactez‑nous à ` },
    law: { title: "Droit applicable", p: "Le présent site est régi par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort de l’éditeur." },
    intro: "Flaash s’engage à offrir un service transparent et conforme aux lois françaises en vigueur.",
    toc: [
      "Éditeur",
      "Hébergement",
      "Propriété intellectuelle",
      "Conditions d’utilisation",
      "Responsabilité",
      "Données personnelles",
      "Droit applicable",
    ],
    linkPrivacy: "👉 Consultez aussi notre Politique de Confidentialité",
    updateNote: "Ces mentions légales peuvent être modifiées à tout moment. Nous vous invitons à les consulter régulièrement.",
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900">📜 {T.title}</h1>
      <p className="text-sm text-gray-500">{T.updated}: {lastUpdate}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{T.intro}</p>
      <p className="mt-2 text-sm text-gray-600"><a className="underline underline-offset-4" href="/privacy">{T.linkPrivacy}</a></p>

      <AnchorNav ariaLabel={language === "fr" ? "Sommaire" : "Table of contents"} items={T.toc.map((label, idx) => ({ href: `#sec_${idx + 1}`, label }))} />

      <div className="mt-6 grid gap-6">
        <SectionCard id="sec_1">
          <SectionHeader title={T.publisher.title} />
          <ul className="mt-3 space-y-1 text-[15px] leading-relaxed text-gray-700">
            <li><span className="font-semibold">{T.publisher.name} :</span> {companyName}</li>
            <li><span className="font-semibold">{T.publisher.form} :</span> {companyForm}</li>
            <li><span className="font-semibold">{T.publisher.siret} :</span> {companySiret}</li>
            <li><span className="font-semibold">{T.publisher.address} :</span> {companyAddress}</li>
            <li><span className="font-semibold">{T.publisher.email} :</span> <ContactBadge email={companyEmail} /></li>
            <li><span className="font-semibold">{T.publisher.phone} :</span> {companyPhone}</li>
            <li><span className="font-semibold">{T.publisher.director} :</span> {directorName}</li>
          </ul>
        </SectionCard>

        <SectionCard id="sec_2">
          <SectionHeader title={T.hosting.title} />
          <ul className="mt-3 space-y-1 text-[15px] leading-relaxed text-gray-700">
            <li><span className="font-semibold">{T.hosting.host} :</span> {hostName}</li>
            <li><span className="font-semibold">{T.hosting.address} :</span> {hostAddress}</li>
            <li><span className="font-semibold">{T.hosting.website} :</span> <a href={hostWebsite} target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">{hostWebsite}</a></li>
          </ul>
        </SectionCard>

        <SectionCard id="sec_3">
          <SectionHeader title={T.ip.title} />
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{T.ip.p}</p>
        </SectionCard>

        <SectionCard id="sec_4">
          <SectionHeader title={T.terms.title} />
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-gray-700">
            {T.terms.items.map((it) => (<li key={it}>{it}</li>))}
          </ul>
        </SectionCard>

        <SectionCard id="sec_5">
          <SectionHeader title={T.liability.title} />
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{T.liability.p}</p>
        </SectionCard>

        <SectionCard id="sec_6">
          <SectionHeader title={T.privacy.title} />
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{T.privacy.p}<ContactBadge email={companyEmail} />.</p>
        </SectionCard>

        <SectionCard id="sec_7">
          <SectionHeader title={T.law.title} />
          <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{T.law.p}</p>
        </SectionCard>
      </div>

      <p className="mt-4 text-sm text-gray-600">{T.updateNote}</p>
    </section>
  )
}
