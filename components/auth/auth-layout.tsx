import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">{children}</div>
}
