import type React from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SettingsSectionProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

export function SettingsSection({ title, icon: Icon, children }: SettingsSectionProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </h3>
          {children}
        </div>
      </div>
    </Card>
  )
}
