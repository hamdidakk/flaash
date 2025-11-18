"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { trackEvent } from "@/lib/analytics"

type TrackedChatLinkProps = {
  href: string
  event?: string
  className?: string
  children: ReactNode
  external?: boolean
}

/**
 * Composant Link qui combine le tracking et la vérification de connexion pour /chat
 * Si l'utilisateur n'est pas connecté, redirige vers /login?redirect=/chat
 */
export function TrackedChatLink({ href, event, className, children, external }: TrackedChatLinkProps) {
  const router = useRouter()
  const { status } = useSessionStore()

  const isChatLink = href === "/chat" || href.startsWith("/chat?")

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (external) {
      // Pour les liens externes, laisser le comportement par défaut
      if (event) {
        trackEvent(event)
      }
      return
    }

    e.preventDefault()

    if (event) {
      trackEvent(event)
    }

    // Si c'est un lien vers /chat, vérifier la connexion
    if (isChatLink) {
      if (status === "authenticated") {
        router.push(href)
      } else {
        router.push(`/login?redirect=${encodeURIComponent(href)}`)
      }
    } else {
      // Pour les autres liens internes, navigation normale
      router.push(href)
    }
  }

  if (external) {
    return (
      <a href={href} className={className} onClick={handleClick} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    )
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}

