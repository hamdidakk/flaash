import type { ReactNode } from "react"

type SectionHeaderProps = {
  title: ReactNode
  icon?: ReactNode
  className?: string
  as?: "h2" | "h3"
}

export function SectionHeader({ title, icon, className, as = "h2" }: SectionHeaderProps) {
  const Tag = as
  const base = "public-section-header"
  const cls = className ? `${base} ${className}` : base
  return <Tag className={cls}>{icon ? <><span className="public-section-header__icon" aria-hidden>{icon}</span>{title}</> : <>{title}</>}</Tag>
}


