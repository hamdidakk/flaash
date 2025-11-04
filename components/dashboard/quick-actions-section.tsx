import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickActionCard } from "@/components/quick-action-card"

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            href={action.href}
          />
        ))}
      </CardContent>
    </Card>
  )
}
