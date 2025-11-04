"use client"

import { useRouter } from "next/navigation"
import { Home, RefreshCw, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { ErrorLayout } from "@/components/error/error-layout"
import { ErrorCard } from "@/components/error/error-card"
import { ErrorActionButton } from "@/components/error/error-action-button"
import type { ErrorCode } from "@/lib/error-handler"

interface ErrorPageProps {
  code: ErrorCode | "generic"
  reset?: () => void
}

export function ErrorPage({ code, reset }: ErrorPageProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const errorKey = code === "generic" ? "generic" : (String(code) as keyof typeof t.errors)
  const error = t.errors[errorKey]

  const handleAction = () => {
    if (code === 401) {
      router.push("/login")
    } else if (code === 500 || code === 503) {
      if (reset) {
        reset()
      } else {
        router.refresh()
      }
    } else {
      router.push("/home")
    }
  }

  const getIcon = () => {
    if (code === 401) return LogIn
    if (code === 500 || code === 503) return RefreshCw
    return Home
  }

  return (
    <ErrorLayout>
      <ErrorCard
        title={error.title}
        description={error.description}
        code={code !== "generic" ? code : undefined}
        action={<ErrorActionButton label={error.action} icon={getIcon()} onClick={handleAction} />}
      />
    </ErrorLayout>
  )
}
