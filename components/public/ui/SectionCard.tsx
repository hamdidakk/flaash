import type { ReactNode } from "react"

type SectionCardProps = {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function SectionCard({ children, className, hover = true }: SectionCardProps) {
  const base = "rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-md"
  const hoverCls = hover ? " transition hover:shadow-lg" : ""
  const cls = className ? `${base}${hoverCls} ${className}` : `${base}${hoverCls}`
  return <div className={cls}>{children}</div>
}


