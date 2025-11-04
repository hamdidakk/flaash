import type React from "react"

interface BoxProps {
  children: React.ReactNode
  padding?: 0 | 2 | 4 | 6 | 8
  className?: string
}

export function Box({ children, padding = 0, className = "" }: BoxProps) {
  const paddingClasses = {
    0: "p-0",
    2: "p-2",
    4: "p-4",
    6: "p-6",
    8: "p-8",
  }

  return <div className={`${paddingClasses[padding]} ${className}`}>{children}</div>
}
