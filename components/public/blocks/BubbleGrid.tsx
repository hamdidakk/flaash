import Link from "next/link"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"

type BubbleItem = {
  label: string
  href: string
  icon?: string
  tooltip?: string
}

export function BubbleGrid({
  title,
  intro,
  items,
  cta,
  tone = "blue",
}: {
  title: string
  intro?: string
  items: BubbleItem[]
  cta?: { href: string; label: string }
  tone?: "blue" | "gray"
}) {
  const toneClasses =
    tone === "blue"
      ? "public-bubble-grid__item--blue"
      : "public-bubble-grid__item--gray"

  return (
    <SectionCard className="public-bubble-grid">
      <SectionHeader title={title} />
      {intro ? <p className="public-bubble-grid__intro">{intro}</p> : null}
      <div className="public-bubble-grid__items">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            title={it.tooltip}
            className={`public-bubble-grid__item group ${toneClasses}`}
          >
            <span className="public-bubble-grid__item-content">
              {it.icon ? (
                <span aria-hidden className="public-bubble-grid__item-icon">{it.icon}</span>
              ) : null}
              <span className="public-bubble-grid__item-label">{it.label}</span>
            </span>
            {it.tooltip ? (
              <span
                className="public-bubble-grid__tooltip"
              >
                {it.tooltip}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      {cta ? (
        <div className="public-bubble-grid__cta">
          <Link href={cta.href} className="public-bubble-grid__cta-link">
            {cta.label}
          </Link>
        </div>
      ) : null}
    </SectionCard>
  )
}


