interface DividerProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Divider({ orientation = "horizontal", className = "" }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={`w-px bg-border ${className}`} />
  }

  return <div className={`h-px bg-border ${className}`} />
}
