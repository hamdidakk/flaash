"use client"

import Link from "next/link"

export function NavLinkNeon({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`public-navlink ${active ? "public-navlink--active" : ""}`}
    >
      {label}
    </Link>
  )
}


