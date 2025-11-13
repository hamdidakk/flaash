import type { ReactNode } from "react"

export function BadgePill({ children, color = "blue", className }: { children: ReactNode; color?: "blue" | "green" | "gray"; className?: string }) {
  const colors: Record<string, string> = {
    blue: "public-badge--blue",
    green: "public-badge--green",
    gray: "public-badge--gray",
  }
  const base = `public-badge ${colors[color]}`
  return <span className={className ? `${base} ${className}` : base}>{children}</span>
}


