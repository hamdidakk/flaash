"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { SettingsSection } from "@/components/dashboard/settings-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { Key, Save } from "lucide-react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")

  const handleSave = () => {
    localStorage.setItem("api_key", apiKey)
    toast({
      title: t("settings.saved"),
      description: t("settings.savedDescription"),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <SettingsSection title={t("settings.apiKey")} icon={Key}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">{t("settings.apiKeyLabel")}</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">{t("settings.apiKeyDescription")}</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {t("settings.save")}
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}
