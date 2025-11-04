import type React from "react"

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8
  className?: string
}

export function Grid({ children, cols = 1, gap = 4, className = "" }: GridProps) {
  const colsClasses = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
    6: "md:grid-cols-3 lg:grid-cols-6",
    12: "md:grid-cols-6 lg:grid-cols-12",
  }

  const gapClasses = {
    2: "gap-2",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }

  return <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>{children}</div>
}
