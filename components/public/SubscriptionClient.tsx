"use client"

import { useLanguage } from "@/lib/language-context"
import { TrackedLink } from "@/components/public/TrackedLink"
import { TrackedChatLink } from "@/components/public/ui/TrackedChatLink"
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
      <section className="public-subscription">
        <div className="public-subscription__intro">
          <h1 className="public-subscription__title">{t("public.subscription.title")}</h1>
          <p className="public-subscription__subtitle">{t("public.subscription.subtitle")}</p>
          <p className="public-subscription__note">💡 Choisissez le mode d’accès qui correspond à votre usage de l’IA Flaash.</p>
        </div>

        <div className="public-subscription__plans">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`public-subscription__card fade-in-up ${
                p.highlighted ? "public-subscription__card--featured" : "public-subscription__card--default"
              }`}
            >
              <div className="public-subscription__card-header">
                <div className="public-subscription__card-heading">
                  <h2 className="public-subscription__card-title">{p.name}</h2>
                  {p.highlighted ? (
                    <span className="public-subscription__badge">Le plus populaire</span>
                  ) : null}
                </div>
                <div className="public-subscription__price">{p.price}</div>
              </div>
              <p className="public-subscription__description">{p.description}</p>
              <ul className="public-subscription__features">
                {p.features.map((f) => (
                  <li key={f.text} className="public-subscription__feature">
                    <span className="public-subscription__feature-icon">{f.icon}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <div className="public-subscription__cta-group">
                {p.ctaHref === "/chat" || p.ctaHref.startsWith("/chat?") ? (
                  <TrackedChatLink
                    href={p.ctaHref}
                    event={p.ctaEvent}
                    className={`public-subscription__cta ${p.highlighted ? "public-subscription__cta--featured" : "public-subscription__cta--default"}`}
                  >
                    {p.highlighted ? <span aria-hidden>💎</span> : <span aria-hidden>🤖</span>}
                    <span className="public-subscription__cta-label">{p.ctaLabel}</span>
                  </TrackedChatLink>
                ) : (
                  <TrackedLink
                    href={p.ctaHref}
                    event={p.ctaEvent}
                    external={p.ctaHref.startsWith("http")}
                    className={`public-subscription__cta ${p.highlighted ? "public-subscription__cta--featured" : "public-subscription__cta--default"}`}
                  >
                    {p.highlighted ? <span aria-hidden>💎</span> : <span aria-hidden>🤖</span>}
                    <span className="public-subscription__cta-label">{p.ctaLabel}</span>
                  </TrackedLink>
                )}

                {p.highlighted && (
                  <TrackedLink
                    href={p.ctaHref}
                    event="pricing_view_plans"
                    external
                    className="public-subscription__secondary-cta"
                  >
                    Voir les formules
                  </TrackedLink>
                )}
              </div>
              {p.highlighted && (
                <p className="public-subscription__fineprint">Annulable à tout moment, sans engagement.</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
