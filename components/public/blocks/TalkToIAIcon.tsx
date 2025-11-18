"use client"

import { ChatLink } from "@/components/public/ui/ChatLink"

export function TalkToIAIcon({ caption, ctaLabel, ctaHref = "/chat" }: { caption?: string; ctaLabel?: string; ctaHref?: string }) {
  // Si c'est un lien vers /chat, utiliser ChatLink, sinon utiliser un lien normal
  const isChatLink = ctaHref === "/chat" || ctaHref?.startsWith("/chat?")

  return (
    <div className="public-ai-card">
      <div className="public-ai-card__halo" />
      <div className="public-ai-card__content">
        <div className="public-ai-card__outer-ring">
          <div className="public-ai-card__inner-ring" />
        </div>
        <div className="public-ai-card__base-ring" />
      </div>
      {caption ? (
        <p className="public-ai-card__caption">{caption}</p>
      ) : null}
      {ctaLabel ? (
        isChatLink ? (
          <ChatLink href={ctaHref} className="public-ai-card__cta">
            {ctaLabel}
          </ChatLink>
        ) : (
          <a
            href={ctaHref}
            className="public-ai-card__cta"
          >
            {ctaLabel}
          </a>
        )
      ) : null}
    </div>
  )
}


