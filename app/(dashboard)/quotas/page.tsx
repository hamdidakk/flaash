"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/language-context"
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"

export default function QuotasPage() {
  const { t } = useLanguage()

  const quotas = [
    { name: "apiRequests", used: 4250, limit: 10000, unit: "requests" },
    { name: "storage", used: 12.5, limit: 50, unit: "GB" },
    { name: "documents", used: 145, limit: 500, unit: "docs" },
    { name: "monthlyCost", used: 127.5, limit: 500, unit: "€" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t("quotas.title")} description={t("quotas.description")} />

      <div className="grid gap-4 md:grid-cols-2">
        {quotas.map((quota) => {
          const percentage = (quota.used / quota.limit) * 100
          const isWarning = percentage > 80
          const isDanger = percentage > 90

          return (
            <Card key={quota.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t(`quotas.quotas.${quota.name}`)}</h3>
                {isDanger ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : isWarning ? (
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} {quota.unit}
                  </span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
                <Progress
                  value={percentage}
                  className={isDanger ? "bg-destructive/20" : isWarning ? "bg-yellow-500/20" : ""}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
