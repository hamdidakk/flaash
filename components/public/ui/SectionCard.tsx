import type { ReactNode, HTMLAttributes } from "react"

type SectionCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
  variant?: "default" | "future" | "surface"
}

export function SectionCard({ children, className, hover = true, variant = "default", ...rest }: SectionCardProps) {
  const base = "rounded-xl border border-gray-200 bg-white p-5 md:p-6 shadow-md"
  const hoverCls = hover ? " transition hover:shadow-lg" : ""
  const variantCls = variant === "future" ? " card-future" : variant === "surface" ? " bg-gray-50" : ""
  const cls = className ? `${base}${hoverCls}${variantCls} ${className}` : `${base}${hoverCls}${variantCls}`
  return <div className={cls} {...rest}>{children}</div>
}


