import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityItem } from "@/components/activity-item"

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            icon={getIcon(activity.type)}
            title={activity.title}
            description={activity.description}
            time={formatTime(activity.timestamp)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
