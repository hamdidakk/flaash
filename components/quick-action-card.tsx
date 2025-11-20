import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export function QuickActionCard({ title, description, icon: Icon, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="dashboard-quick-action">
        <CardContent className="dashboard-quick-action__body">
          <div className="dashboard-quick-action__content">
            <div className="dashboard-quick-action__icon">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="dashboard-quick-action__title">{title}</h3>
              <p className="dashboard-quick-action__description">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
