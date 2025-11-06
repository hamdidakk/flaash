"use client"

import { useState } from "react"

export function PublicLogo({ className }: { className?: string }) {
  const [src, setSrc] = useState<string>("/logo.svg")
  return (
    <img
      src={src}
      alt="FLAASH"
      className={`logo-auto ${className || ""}`}
      onError={() => setSrc("/logo.png")}
    />
  )
}


