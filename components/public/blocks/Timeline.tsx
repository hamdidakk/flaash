import type { ReactNode } from "react"

export type TimelineItem = { label: string; description: string; icon?: ReactNode }

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="public-timeline">
      <ol className="public-timeline__list">
        {items.map((it, idx) => (
          <li key={idx} className="public-timeline__item">
            <div className="public-timeline__label">
              {it.label} {it.icon}
            </div>
            <p className="public-timeline__description">{it.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}


