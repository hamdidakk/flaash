import type React from "react"
import type { LucideIcon } from "lucide-react"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"

interface SettingsSectionProps {
  title: string
  icon: LucideIcon
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

export function SettingsSection({ title, icon, description, actions, children }: SettingsSectionProps) {
  return (
    <DashboardSectionCard title={title} icon={icon} description={description} actions={actions}>
      {children}
    </DashboardSectionCard>
  )
}
