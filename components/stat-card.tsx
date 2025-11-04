import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold mt-3 text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={`text-sm font-semibold ${trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
          </div>
          <div className="ml-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
              <Icon className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
