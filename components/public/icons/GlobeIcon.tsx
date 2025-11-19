"use client"

import type { SVGProps } from "react"

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9m0-18c2 2.5 3 5.5 3 9s-1 6.5-3 9m-9-9h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4.5 8h15M4.5 16h15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

