import type React from "react"

interface CenterProps {
  children: React.ReactNode
  fullHeight?: boolean
  className?: string
}

export function Center({ children, fullHeight = false, className = "" }: CenterProps) {
  return (
    <div className={`flex items-center justify-center ${fullHeight ? "min-h-screen" : ""} ${className}`}>
      {children}
    </div>
  )
}
