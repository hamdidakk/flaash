import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorIcon } from "./error-icon"

interface ErrorCardProps {
  title: string
  description: string
  code?: string | number
  action?: React.ReactNode
}

export function ErrorCard({ title, description, code, action }: ErrorCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <ErrorIcon />
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {code && (
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">Error Code: {code}</p>
        </CardContent>
      )}
      {action && <CardFooter className="flex justify-center">{action}</CardFooter>}
    </Card>
  )
}
