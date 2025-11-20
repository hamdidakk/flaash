import type { LucideIcon } from "lucide-react"

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  time: string
}

export function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="dashboard-activity-item">
      <div className="dashboard-activity-item__icon">
        <Icon className="h-4 w-4" />
      </div>
      <div className="dashboard-activity-item__content">
        <p className="dashboard-activity-item__title">{title}</p>
        <p className="dashboard-activity-item__description">{description}</p>
      </div>
      <span className="dashboard-activity-item__time">{time}</span>
    </div>
  )
}
