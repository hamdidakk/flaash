"use client"

import { PageHeader } from "@/components/page-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { ChartCard } from "@/components/dashboard/chart-card"
import { MetricBar } from "@/components/dashboard/metric-bar"
import { useLanguage } from "@/lib/language-context"
import { DollarSign, TrendingUp, Zap, Target } from "lucide-react"

export default function AnalyticsPage() {
  const { t } = useLanguage()

  const statsData = [
    { title: t("analytics.totalCost"), value: "€127.50", change: "+12.5%", icon: DollarSign },
    { title: t("analytics.avgCostPerQuery"), value: "€0.023", change: "-5.2%", icon: TrendingUp },
    { title: t("analytics.totalQueries"), value: "5,543", change: "+18.3%", icon: Zap },
    { title: t("analytics.avgQuality"), value: "8.7/10", change: "+0.3", icon: Target },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t("analytics.title")} description={t("analytics.description")} />

      <StatsGrid stats={statsData} />

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title={t("analytics.costTrend")}>
          <div className="h-64 flex items-center justify-center text-muted-foreground">Chart placeholder</div>
        </ChartCard>

        <ChartCard title={t("analytics.qualityMetrics")}>
          <div className="space-y-4">
            <MetricBar label={t("analytics.retrieval")} value="9.9/10" percentage={99} color="bg-green-500" />
            <MetricBar label={t("analytics.generation")} value="7.6/10" percentage={76} color="bg-blue-500" />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
