import type React from "react"
import { Card } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="dashboard-card">
      <h3 className="dashboard-card__title">{title}</h3>
      {children}
    </Card>
  )
}
