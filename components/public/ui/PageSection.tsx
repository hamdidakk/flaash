import type { HTMLAttributes, ReactNode } from "react"

type PageSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  maxW?: "5xl" | "6xl" | "7xl"
  px?: "4" | "6"
  py?: string
}

export function PageSection({ children, className, maxW = "6xl", px = "4", py = "0", ...rest }: PageSectionProps) {
  const maxWCls = maxW === "5xl" ? "max-w-5xl" : maxW === "7xl" ? "max-w-7xl" : "max-w-6xl"
  const pxCls = px === "6" ? "px-6" : "px-4"
  const pyCls = py ? `py-${py}` : ""
  const base = `mx-auto ${maxWCls} ${pxCls} ${pyCls}`.trim()
  const cls = className ? `${base} ${className}` : base
  return (
    <section className={cls} {...rest}>
      {children}
    </section>
  )
}


