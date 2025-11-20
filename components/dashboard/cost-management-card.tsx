"use client"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, AlertTriangle, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"

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
    <DashboardSectionCard
      title={t("dashboard.costs.title")}
      description={t("dashboard.costs.description")}
      icon={DollarSign}
      actions={
        <Button variant="outline" size="sm" className="cta-accent">
          <Settings className="h-4 w-4 mr-2" />
          {t("dashboard.costs.setAlert")}
        </Button>
      }
    >
      <div className="dashboard-grid-3">
        <div className="dashboard-stat-group">
          <div className="dashboard-stat-label">
            <DollarSign className="h-4 w-4" />
            {t("dashboard.costs.totalCost")}
          </div>
          <div className="dashboard-stat-value">${safeTotal.toFixed(2)}</div>
        </div>

        <div className="dashboard-stat-group">
          <div className="dashboard-stat-label">
            <TrendingUp className="h-4 w-4" />
            {t("dashboard.costs.tokensUsed")}
          </div>
          <div className="dashboard-stat-value">{(safeTokens / 1000).toFixed(1)}K</div>
        </div>

        <div className="dashboard-stat-group">
          <div className="dashboard-stat-label">
            <DollarSign className="h-4 w-4" />
            {t("dashboard.costs.estimatedCost")}
          </div>
          <div className="dashboard-stat-value">${safeEstimated.toFixed(2)}</div>
        </div>
      </div>

      <div className="dashboard-breakdown">
        <div className="dashboard-breakdown__row">
          <span className="font-medium">{t("dashboard.costs.costBreakdown")}</span>
        </div>

        <div className="dashboard-breakdown">
          <div className="dashboard-breakdown__item">
            <div className="dashboard-breakdown__row">
              <span className="dashboard-breakdown__label">{t("dashboard.costs.operations.embedding")}</span>
              <span className="dashboard-breakdown__metric">${embedding.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (embedding / safeTotal) * 100 : 0} className="dashboard-progress" />
          </div>

          <div className="dashboard-breakdown__item">
            <div className="dashboard-breakdown__row">
              <span className="dashboard-breakdown__label">{t("dashboard.costs.operations.completion")}</span>
              <span className="dashboard-breakdown__metric">${completion.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (completion / safeTotal) * 100 : 0} className="dashboard-progress" />
          </div>

          <div className="dashboard-breakdown__item">
            <div className="dashboard-breakdown__row">
              <span className="dashboard-breakdown__label">{t("dashboard.costs.operations.search")}</span>
              <span className="dashboard-breakdown__metric">${search.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (search / safeTotal) * 100 : 0} className="dashboard-progress" />
          </div>

          <div className="dashboard-breakdown__item">
            <div className="dashboard-breakdown__row">
              <span className="dashboard-breakdown__label">{t("dashboard.costs.operations.storage")}</span>
              <span className="dashboard-breakdown__metric">${storage.toFixed(2)}</span>
            </div>
            <Progress value={safeTotal > 0 ? (storage / safeTotal) * 100 : 0} className="dashboard-progress" />
          </div>
        </div>
      </div>

      {data.alerts.isNearLimit && (
        <div className="dashboard-alert dashboard-alert--warning">
          <AlertTriangle className="dashboard-alert__icon" />
          <div className="dashboard-alert__body">
            <p className="dashboard-alert__title">
              {t("dashboard.costs.alertMessage")}
            </p>
            <div className="space-y-1">
              <div className="dashboard-alert__meta">
                <span>
              {t("dashboard.costs.current")}: ${alertCurrent.toFixed(2)}
                </span>
                <span>
                  {t("dashboard.costs.threshold")}: ${alertThreshold.toFixed(2)}
                </span>
              </div>
              <Progress value={usagePercentage} className="dashboard-progress bg-orange-200 dark:bg-orange-900" />
            </div>
          </div>
        </div>
      )}
    </DashboardSectionCard>
  )
}
