import type { ReactNode } from "react"

type SectionHeaderProps = {
  title: ReactNode
  icon?: ReactNode
  className?: string
  as?: "h2" | "h3"
}

export function SectionHeader({ title, icon, className, as = "h2" }: SectionHeaderProps) {
  const Tag = as
  const base = "inline-block rounded bg-gradient-to-r from-purple-50 to-blue-50 px-2 py-1 text-base font-semibold text-slate-800"
  const cls = className ? `${base} ${className}` : base
  return <Tag className={cls}>{icon ? <><span className="mr-1" aria-hidden>{icon}</span>{title}</> : <>{title}</>}</Tag>
}


