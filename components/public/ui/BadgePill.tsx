import type { ReactNode } from "react"

export function BadgePill({ children, color = "blue", className }: { children: ReactNode; color?: "blue" | "green" | "gray"; className?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-1 ring-green-200",
    gray: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  }
  const base = `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colors[color]}`
  return <span className={className ? `${base} ${className}` : base}>{children}</span>
}


