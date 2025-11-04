import type React from "react"

interface FlexProps {
  children: React.ReactNode
  direction?: "row" | "col"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
  gap?: 2 | 4 | 6 | 8
  wrap?: boolean
  className?: string
}

export function Flex({
  children,
  direction = "row",
  align = "start",
  justify = "start",
  gap = 4,
  wrap = false,
  className = "",
}: FlexProps) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
  }

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  }

  const gapClasses = {
    2: "gap-2",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }

  return (
    <div
      className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${gapClasses[gap]} ${wrap ? "flex-wrap" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
