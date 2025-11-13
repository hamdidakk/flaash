import type { ReactNode } from "react"
import { TrackedLink } from "@/components/public/TrackedLink"

type SecondaryCTAProps = {
  href: string
  event: string
  children: ReactNode
  external?: boolean
  className?: string
  icon?: ReactNode
}

export function SecondaryCTA({ href, event, children, external, className, icon }: SecondaryCTAProps) {
  const base = "public-cta-secondary"
  const cls = className ? `${base} ${className}` : base
  return (
    <TrackedLink href={href} external={external} event={event} className={cls}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className={icon ? "public-cta-secondary__icon" : undefined}>{children}</span>
    </TrackedLink>
  )
}


