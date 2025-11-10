"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, AlertTriangle, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface CostData {
  totalCost: number
  tokensUsed: number
  estimatedCost: number
  breakdown: {
    embedding: number
    completion: number
    search: number
    storage: number
  }
  alerts: {
    threshold: number
    current: number
    isNearLimit: boolean
  }
}

interface CostManagementCardProps {
  data: CostData
}

export function CostManagementCard({ data }: CostManagementCardProps) {
  const { t } = useLanguage()
  const safeTotal = Number(data.totalCost) || 0
  const safeTokens = Number(data.tokensUsed) || 0
  const safeEstimated = Number(data.estimatedCost) || 0
  const bd = data.breakdown || { embedding: 0, completion: 0, search: 0, storage: 0 }
  const embedding = Number(bd.embedding) || 0
  const completion = Number(bd.completion) || 0
  const search = Number(bd.search) || 0
  const storage = Number(bd.storage) || 0
  const alertCurrent = Number(data.alerts?.current) || 0
  const alertThreshold = Number(data.alerts?.threshold) || 0
  const usagePercentage = alertThreshold > 0 ? (alertCurrent / alertThreshold) * 100 : 0

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("dashboard.costs.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("dashboard.costs.description")}</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          {t("dashboard.costs.setAlert")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            {t("dashboard.costs.totalCost")}
          </div>
          <div className="text-2xl font-bold">${safeTotal.toFixed(2)}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            {t("dashboard.costs.tokensUsed")}
          </div>
          <div className="text-2xl font-bold">{(safeTokens / 1000).toFixed(1)}K</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            {t("dashboard.costs.estimatedCost")}
          </div>
          <div className="text-2xl font-bold">${safeEstimated.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{t("dashboard.costs.costBreakdown")}</span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.costs.operations.embedding")}</span>
              <span className="font-medium">${embedding.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (embedding / safeTotal) * 100 : 0} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.costs.operations.completion")}</span>
              <span className="font-medium">${completion.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (completion / safeTotal) * 100 : 0} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.costs.operations.search")}</span>
              <span className="font-medium">${search.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (search / safeTotal) * 100 : 0} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("dashboard.costs.operations.storage")}</span>
              <span className="font-medium">${storage.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (storage / safeTotal) * 100 : 0} className="h-2" />
          </div>
        </div>
      </div>

      {data.alerts.isNearLimit && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              {t("dashboard.costs.alertMessage")}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-300">
                <span>
              {t("dashboard.costs.current")}: ${alertCurrent.toFixed(2)}
                </span>
                <span>
                  {t("dashboard.costs.threshold")}: ${alertThreshold.toFixed(2)}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2 bg-orange-200 dark:bg-orange-900" />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
