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
  const base = "inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
  const cls = className ? `${base} ${className}` : base
  return (
    <TrackedLink href={href} external={external} event={event} className={cls}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className={icon ? "ml-2" : undefined}>{children}</span>
    </TrackedLink>
  )
}


