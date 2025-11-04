import type React from "react"

interface ContainerProps {
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  padding?: boolean
  className?: string
}

export function Container({ children, size = "lg", padding = true, className = "" }: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  }

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${padding ? "px-4 sm:px-6 lg:px-8" : ""} ${className}`}>
      {children}
    </div>
  )
}
