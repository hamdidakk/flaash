"use client"

import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export interface ThrottlingAlertProps {
  retryAfterLabel?: string
  onRetry?: () => void
  reason?: string
}

export function ThrottlingAlert({ retryAfterLabel, onRetry, reason }: ThrottlingAlertProps) {
  const { t } = useLanguage()

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("throttling.title")}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{reason ?? t("throttling.description")}</p>
        {retryAfterLabel && <p className="text-xs uppercase text-muted-foreground">{retryAfterLabel}</p>}
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {t("throttling.retry")}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}


