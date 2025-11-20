"use client"

import Link from "next/link"
import { FlaashWordmark } from "@/components/public/FlaashWordmark"

export function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <Link href="/" className="sidebar-logo__link" aria-label="Accueil FLAASH">
        <FlaashWordmark className="sidebar-logo__mark" />
      </Link>
    </div>
  )
}
