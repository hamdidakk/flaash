import type { HTMLAttributes, ReactNode } from "react"

type PageSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  maxW?: "5xl" | "6xl" | "7xl"
  px?: "4" | "6"
  py?: string
}

export function PageSection({ children, className, maxW = "6xl", px = "4", py = "0", ...rest }: PageSectionProps) {
  const classes = ["public-page-section"]
  if (maxW === "5xl") classes.push("public-page-section--max-5xl")
  if (maxW === "7xl") classes.push("public-page-section--max-7xl")
  if (px === "6") classes.push("public-page-section--px-6")
  if (py === "8") classes.push("public-page-section--py-8")
  if (py === "10") classes.push("public-page-section--py-10")
  if (py === "12") classes.push("public-page-section--py-12")
  if (py === "16") classes.push("public-page-section--py-16")
  const base = classes.join(" ")
  const cls = className ? `${base} ${className}` : base
  return (
    <section className={cls} {...rest}>
      {children}
    </section>
  )
}


