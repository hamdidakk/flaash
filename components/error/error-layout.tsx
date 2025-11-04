import type React from "react"

interface ErrorLayoutProps {
  children: React.ReactNode
}

export function ErrorLayout({ children }: ErrorLayoutProps) {
  return <div className="flex min-h-screen items-center justify-center p-4">{children}</div>
}
