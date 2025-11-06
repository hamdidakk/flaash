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
      description: t("public.subscription.plans.free.desc"),
      features: [
        "3 questions par session anonyme",
        "Citations et extraits",
        "Accès web (mobile & desktop)",
      ],
      ctaLabel: t("public.subscription.plans.ctaChat"),
      ctaHref: "/chat",
      ctaEvent: "pricing_chat_free",
      highlighted: false,
    },
    {
      name: t("public.subscription.plans.paid.name"),
      price: "À partir de 6€/mois",
      description: t("public.subscription.plans.paid.desc"),
      features: [
        "Usage étendu (illimité selon formule)",
        "Améliorations prioritaires",
        "Accès aux nouveautés",
      ],
      ctaLabel: t("public.subscription.plans.ctaSubscribe"),
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
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card-future rounded-xl border p-6 ${p.highlighted ? "border-black ring-1 ring-black" : "border-gray-200"}`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <div className="text-sm text-gray-600">{p.price}</div>
              </div>
              <p className="mt-2 text-gray-700">{p.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-800" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <TrackedLink
                  href={p.ctaHref}
                  event={p.ctaEvent}
                  external={p.ctaHref.startsWith("http")}
                  className={`cta-futuriste inline-block rounded-md px-4 py-2 text-sm font-medium ${
                    p.highlighted
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p.ctaLabel}
                </TrackedLink>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
