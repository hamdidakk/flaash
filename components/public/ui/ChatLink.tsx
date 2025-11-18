"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useSessionStore } from "@/store/session-store"

type ChatLinkProps = {
  children: ReactNode
  href?: string
  className?: string
  onClick?: () => void
}

/**
 * Composant Link qui vérifie la connexion avant de rediriger vers /chat
 * Si l'utilisateur n'est pas connecté, redirige vers /login?redirect=/chat
 */
export function ChatLink({ children, href = "/chat", className, onClick }: ChatLinkProps) {
  const router = useRouter()
  const { status } = useSessionStore()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    }
    if (status === "authenticated") {
      router.push(href)
    } else {
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

