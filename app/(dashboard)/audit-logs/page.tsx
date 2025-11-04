"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Upload, Trash2, Settings, User } from "lucide-react"

export default function AuditLogsPage() {
  const { t } = useLanguage()

  const logs = [
    {
      id: 1,
      action: "document.uploaded",
      user: "john@acme.com",
      details: 'Uploaded "specs.pdf"',
      timestamp: "2025-01-15 14:30:25",
      icon: Upload,
    },
    {
      id: 2,
      action: "settings.updated",
      user: "jane@acme.com",
      details: "Changed API key",
      timestamp: "2025-01-15 13:15:10",
      icon: Settings,
    },
    {
      id: 3,
      action: "document.deleted",
      user: "john@acme.com",
      details: 'Deleted "old-doc.pdf"',
      timestamp: "2025-01-15 11:45:00",
      icon: Trash2,
    },
    {
      id: 4,
      action: "user.invited",
      user: "admin@acme.com",
      details: "Invited bob@acme.com",
      timestamp: "2025-01-15 09:20:15",
      icon: User,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t("auditLogs.title")} description={t("auditLogs.description")} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("auditLogs.table.action")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("auditLogs.table.user")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("auditLogs.table.details")}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{t("auditLogs.table.timestamp")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => {
                const Icon = log.icon
                return (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{t(`auditLogs.actions.${log.action}`)}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{log.user}</td>
                    <td className="px-4 py-3">{log.details}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{log.timestamp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
