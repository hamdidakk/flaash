import type { LucideIcon } from "lucide-react"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  change?: string
}

export function StatCard({ title, value, icon, trend, description, change }: StatCardProps) {
  return (
    <DashboardSectionCard
      title={title}
      icon={icon}
      meta={
        trend ? (
          <span className={`text-sm font-semibold ${trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        ) : null
      }
      bodyClassName="space-y-2"
    >
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {change ? <p className="text-xs text-muted-foreground">{change}</p> : null}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </DashboardSectionCard>
  )
}
