import type { ReactNode, HTMLAttributes } from "react"

type SectionCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
  variant?: "default" | "future" | "surface"
}

export function SectionCard({ children, className, hover = true, variant = "default", ...rest }: SectionCardProps) {
  const classes = ["public-card"]
  if (hover) classes.push("public-card--hover")
  if (!hover) classes.push("public-card--no-hover")
  if (variant === "future") classes.push("card-future")
  if (variant === "surface") classes.push("public-card--surface")
  const base = classes.join(" ")
  const cls = className ? `${base} ${className}` : base
  return <div className={cls} {...rest}>{children}</div>
}


