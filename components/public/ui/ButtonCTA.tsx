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
  const base = "inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
  const cls = className ? `${base} ${className}` : base
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick as any}>
        {icon ? <span aria-hidden>{icon}</span> : null}
        <span className={icon ? "ml-2" : undefined}>{children}</span>
      </Link>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className={icon ? "ml-2" : undefined}>{children}</span>
    </button>
  )
}


