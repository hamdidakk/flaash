"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { Download, Trash2, Shield, AlertTriangle } from "lucide-react"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <PageHeader title={t("privacy.title")} description={t("privacy.description")} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{t("privacy.exportData")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("privacy.exportDescription")}</p>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                {t("privacy.export")}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{t("privacy.deleteAccount")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("privacy.deleteDescription")}</p>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("privacy.delete")}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{t("privacy.dataRetention")}</h3>
              <p className="text-sm text-muted-foreground">{t("privacy.retentionDescription")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{t("privacy.gdprCompliance")}</h3>
              <p className="text-sm text-muted-foreground">{t("privacy.gdprDescription")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
