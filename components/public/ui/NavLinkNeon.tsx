"use client"

import Link from "next/link"

export function NavLinkNeon({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "relative z-10 inline-flex h-9 items-center cursor-pointer pointer-events-auto rounded px-2 text-[15px] text-gray-900 after:pointer-events-none after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-cyan-400 after:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          : "relative z-10 inline-flex h-9 items-center cursor-pointer pointer-events-auto rounded px-2 text-[15px] text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
      }
    >
      {label}
    </Link>
  )
}


