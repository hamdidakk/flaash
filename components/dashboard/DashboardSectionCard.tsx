import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardSectionCardProps {
  title: string
  description?: ReactNode
  icon?: LucideIcon
  meta?: ReactNode
  actions?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

export function DashboardSectionCard({
  title,
  description,
  icon: Icon,
  meta,
  actions,
  className,
  bodyClassName,
  children,
}: DashboardSectionCardProps) {
  return (
    <Card className={cn("dashboard-section-card", className)}>
      <div className="dashboard-section-card__header">
        <div className="dashboard-section-card__title-group">
          {Icon ? (
            <div className="dashboard-section-card__icon-wrapper">
              <Icon className="dashboard-section-card__icon" />
            </div>
          ) : null}
          <div>
            <h3 className="dashboard-section-card__title">{title}</h3>
            {description
              ? typeof description === "string"
                ? <p className="dashboard-section-card__description">{description}</p>
                : <div className="dashboard-section-card__description">{description}</div>
              : null}
          </div>
        </div>
        {meta ? <div className="dashboard-section-card__meta">{meta}</div> : null}
      </div>

      {actions ? <div className="dashboard-section-card__actions">{actions}</div> : null}

      <div className={cn("dashboard-section-card__body", bodyClassName)}>{children}</div>
    </Card>
  )
}

