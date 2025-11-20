"use client"

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Webhook, Plus, MoreVertical } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function WebhooksPage() {
  const { t } = useLanguage()

  const webhooks = [
    {
      id: 1,
      url: "https://api.example.com/webhook",
      events: ["document.uploaded", "chat.completed"],
      status: "active",
      calls: 1250,
    },
    { id: 2, url: "https://hooks.slack.com/services/...", events: ["alert.triggered"], status: "active", calls: 45 },
  ]

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("webhooks.title")}
        description={t("webhooks.description")}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("webhooks.create")}
          </Button>
        }
      />

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Webhook className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{webhook.url}</code>
                    <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                      {t(`alerts.status.${webhook.status}`)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {t(`webhooks.events.${event}`)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {webhook.calls} {t("webhooks.calls")}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

