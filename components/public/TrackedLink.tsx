"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

interface TrackedLinkProps {
  href: string
  children: React.ReactNode
  event: string
  external?: boolean
  className?: string
}

export function TrackedLink({ href, children, event, external, className }: TrackedLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        onClick={() => trackEvent(event)}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </Link>
  )
}


