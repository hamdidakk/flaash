import type { LucideIcon } from "lucide-react"
import { StatCard } from "@/components/stat-card"

interface Stat {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  change?: string
}

interface StatsGridProps {
  stats: Stat[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="dashboard-grid-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          change={stat.change}
        />
      ))}
    </div>
  )
}
