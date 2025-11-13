export function TalkToIAIcon({ caption, ctaLabel, ctaHref = "/chat" }: { caption?: string; ctaLabel?: string; ctaHref?: string }) {
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
        <a
          href={ctaHref}
          className="public-ai-card__cta"
        >
          {ctaLabel}
        </a>
      ) : null}
    </div>
  )
}


