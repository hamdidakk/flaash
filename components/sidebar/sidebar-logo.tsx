"use client"

import Link from "next/link"

export function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <Link href="/home" className="sidebar-logo__link">
        <div className="sidebar-logo__icon">
          <span className="sidebar-logo__text">R</span>
        </div>
        <span className="sidebar-logo__text">RAG SaaS</span>
      </Link>
    </div>
  )
}
