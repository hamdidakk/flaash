import type { LucideIcon } from "lucide-react"
import { QuickActionCard } from "@/components/quick-action-card"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"

interface QuickAction {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

interface QuickActionsSectionProps {
  title: string
  description: string
  actions: QuickAction[]
}

export function QuickActionsSection({ title, description, actions }: QuickActionsSectionProps) {
  return (
    <DashboardSectionCard title={title} description={description}>
      <div className="dashboard-grid-2">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            href={action.href}
          />
        ))}
      </div>
    </DashboardSectionCard>
  )
}
