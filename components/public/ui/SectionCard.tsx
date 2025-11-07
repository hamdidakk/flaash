import type { ReactNode, HTMLAttributes } from "react"

type SectionCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
}

export function SectionCard({ children, className, hover = true, ...rest }: SectionCardProps) {
  const base = "rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-md"
  const hoverCls = hover ? " transition hover:shadow-lg" : ""
  const cls = className ? `${base}${hoverCls} ${className}` : `${base}${hoverCls}`
  return <div className={cls} {...rest}>{children}</div>
}


