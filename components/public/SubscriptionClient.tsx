"use client"

import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { PageView } from "@/components/public/PageView"

export function SubscriptionClient() {
  const { t } = useLanguage()
  const plans = [
    {
      name: t("public.subscription.plans.free.name"),
      price: "Gratuit",
      description: "Découvrez l’IA en toute liberté 🌍",
      features: [
        { icon: "🆓", text: "Posez jusqu’à 3 questions gratuites par session" },
        { icon: "📚", text: "Accédez à des citations et extraits inspirants" },
        { icon: "📱", text: "Utilisez-la sur mobile et ordinateur" },
      ],
      ctaLabel: "Parler à l’IA",
      ctaHref: "/chat",
      ctaEvent: "pricing_chat_free",
      highlighted: false,
    },
    {
      name: t("public.subscription.plans.paid.name"),
      price: "À partir de 6€/mois, sans engagement.",
      description: "Passez à la vitesse supérieure 🚀",
      features: [
        { icon: "⚡", text: "Accès illimité à l’Agent IA (selon formule)" },
        { icon: "🧠", text: "Priorité sur les nouvelles fonctionnalités" },
        { icon: "🔓", text: "Accès anticipé aux nouveautés" },
        { icon: "⭐", text: "Support premium et mises à jour en avant-première" },
      ],
      ctaLabel: "S’abonner",
      ctaHref: "https://boutique.flaash.fr",
      ctaEvent: "pricing_subscribe",
      highlighted: true,
    },
  ]

  return (
    <>
      <PageView page="abonnement" />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{t("public.subscription.title")}</h1>
          <p className="mt-3 text-gray-600">{t("public.subscription.subtitle")}</p>
          <p className="mt-4 text-sm text-gray-700">💡 Choisissez le mode d’accès qui correspond à votre usage de l’IA Flaash.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`fade-in-up card-future rounded-xl border p-5 transition-transform duration-200 hover:-translate-y-0.5 ${
                p.highlighted
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg shadow-blue-100"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{p.name}</h2>
                  {p.highlighted && (
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">Le plus populaire</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-primary">{p.price}</div>
              </div>
              <p className="mt-2 text-gray-700">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-gray-800">
                {p.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2">
                    <span className="mt-0.5 select-none">{f.icon}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TrackedLink
                  href={p.ctaHref}
                  event={p.ctaEvent}
                  external={p.ctaHref.startsWith("http")}
                  className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-transform will-change-transform ${
                    p.highlighted
                      ? "cta-futuriste btn-pulse hover:scale-105 text-white"
                      : "border border-gray-300 hover:bg-gray-50 hover:scale-105"
                  }`}
                >
                  {p.highlighted ? <span aria-hidden>💎</span> : <span aria-hidden>🤖</span>}
                  <span className="ml-2">{p.ctaLabel}</span>
                </TrackedLink>

                {p.highlighted && (
                  <TrackedLink
                    href={p.ctaHref}
                    event="pricing_view_plans"
                    external
                    className="inline-flex items-center rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Voir les formules
                  </TrackedLink>
                )}
              </div>
              {p.highlighted && (
                <p className="mt-2 text-xs text-gray-600">Annulable à tout moment, sans engagement.</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
