import type React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = "space-y-6" }: PageContainerProps) {
  return <div className={className}>{children}</div>
}
