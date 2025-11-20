import type { LucideIcon } from "lucide-react"
import { ActivityItem } from "@/components/activity-item"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
}

interface RecentActivitySectionProps {
  title: string
  description: string
  activities: Activity[]
  getIcon: (type: string) => LucideIcon
  formatTime: (timestamp: Date) => string
}

export function RecentActivitySection({
  title,
  description,
  activities,
  getIcon,
  formatTime,
}: RecentActivitySectionProps) {
  return (
    <DashboardSectionCard title={title} description={description}>
      <div className="dashboard-stack">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            icon={getIcon(activity.type)}
            title={activity.title}
            description={activity.description}
            time={formatTime(activity.timestamp)}
          />
        ))}
      </div>
    </DashboardSectionCard>
  )
}
