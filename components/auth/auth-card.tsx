import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  const hasHeader = title || description
  return (
    <Card className="auth-card w-full max-w-[460px]">
      {hasHeader && (
        <CardHeader className="space-y-1">
          {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={hasHeader ? "" : "pt-6"}>
        {children}
        {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
      </CardContent>
    </Card>
  )
}
