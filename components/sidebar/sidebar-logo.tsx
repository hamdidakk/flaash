"use client"

import Link from "next/link"

export function SidebarLogo() {
  return (
    <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-primary/5 to-transparent">
      <Link href="/home" className="flex items-center gap-2 font-semibold">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <span className="text-lg font-bold">R</span>
        </div>
        <span className="text-lg font-bold">RAG SaaS</span>
      </Link>
    </div>
  )
}
