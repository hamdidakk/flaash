"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useSessionStore } from "@/store/session-store"

type ButtonCTAProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

export function ButtonCTA({ children, href, onClick, className, icon }: ButtonCTAProps) {
  const router = useRouter()
  const { status } = useSessionStore()
  const base = "public-cta-primary"
  const cls = className ? `${base} ${className}` : base

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }
    // Si c'est un lien vers /chat, vérifier la connexion
    if (href === "/chat" || href?.startsWith("/chat?")) {
      e.preventDefault()
      if (status === "authenticated") {
        router.push(href)
      } else {
        router.push(`/login?redirect=${encodeURIComponent(href || "/chat")}`)
      }
    }
  }

  if (href) {
    return (
      <Link href={href} className={cls} onClick={handleClick as any}>
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


