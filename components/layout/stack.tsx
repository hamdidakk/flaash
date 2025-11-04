import type React from "react"

interface StackProps {
  children: React.ReactNode
  spacing?: 2 | 4 | 6 | 8
  className?: string
}

export function Stack({ children, spacing = 4, className = "" }: StackProps) {
  const spacingClasses = {
    2: "space-y-2",
    4: "space-y-4",
    6: "space-y-6",
    8: "space-y-8",
  }

  return <div className={`${spacingClasses[spacing]} ${className}`}>{children}</div>
}
