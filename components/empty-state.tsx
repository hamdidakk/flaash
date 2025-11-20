"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card-empty-state">
      <div className="card-empty-state__icon">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="card-empty-state__title">{title}</h3>
      <p className="card-empty-state__description">{description}</p>
      {action && <Button className="cta-accent" onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
