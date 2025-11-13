import type { ReactNode } from "react"

export function IconItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="public-icon-list__item">
      <span className="public-icon-list__icon" aria-hidden>
        {icon}
      </span>
      <span>{children}</span>
    </li>
  )
}
