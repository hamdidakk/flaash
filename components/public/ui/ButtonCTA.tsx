import Link from "next/link"
import type { ReactNode } from "react"

type ButtonCTAProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

export function ButtonCTA({ children, href, onClick, className, icon }: ButtonCTAProps) {
  const base = "public-cta-primary"
  const cls = className ? `${base} ${className}` : base
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick as any}>
        {icon ? <span aria-hidden>{icon}</span> : null}
        <span className={icon ? "public-cta-primary__icon" : undefined}>{children}</span>
      </Link>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className={icon ? "public-cta-primary__icon" : undefined}>{children}</span>
    </button>
  )
}


