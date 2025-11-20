"use client"

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { Bell, Plus, AlertTriangle } from "lucide-react"

export default function AlertsPage() {
  const { t } = useLanguage()

  const alerts = [
    { id: 1, name: "Cost Threshold", condition: "Cost > €400/month", status: "active", triggered: 0 },
    { id: 2, name: "Quota Warning", condition: "Usage > 80%", status: "active", triggered: 2 },
    { id: 3, name: "Error Rate", condition: "Errors > 5%", status: "paused", triggered: 0 },
  ]

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("alerts.title")}
        description={t("alerts.description")}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("alerts.create")}
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("alerts.table.name")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("alerts.table.condition")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("alerts.table.status")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("alerts.table.triggered")}</th>
                <th className="px-4 py-3 text-right text-sm font-medium">{t("alerts.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{alert.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{alert.condition}</td>
                  <td className="px-4 py-3">
                    <Badge variant={alert.status === "active" ? "default" : "secondary"}>
                      {t(`alerts.status.${alert.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {alert.triggered > 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{alert.triggered}x</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        {t("common.edit")}
                      </Button>
                      <Button variant="ghost" size="sm">
                        {t("common.delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

