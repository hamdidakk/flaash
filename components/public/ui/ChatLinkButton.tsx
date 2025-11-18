"use client"

import { useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import type { ReactNode } from "react"

type ChatLinkButtonProps = {
  children: ReactNode
  href: string
  className?: string
}

/**
 * Composant bouton/lien client qui vérifie la connexion avant de rediriger vers /chat
 * Utilisé dans les composants serveur où on ne peut pas utiliser ChatLink directement
 */
export function ChatLinkButton({ children, href, className }: ChatLinkButtonProps) {
  const router = useRouter()
  const { status } = useSessionStore()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (status === "authenticated") {
      router.push(href)
    } else {
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}

