"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { SettingsSection } from "@/components/dashboard/settings-section"
import { RegenerateKeyDialog } from "@/components/settings/regenerate-key-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { Key, RefreshCw, Copy, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("api_key")
      if (savedKey) {
        setApiKey(savedKey)
      }
    }
  }, [])

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("api_key", apiKey)
      toast({
        title: t("settings.saved"),
        description: t("settings.savedDescription"),
      })
    }
  }

  const handleRegenerateKey = () => {
    // Generate a new API key (in production, this would be an API call)
    const newKey = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    setNewlyGeneratedKey(newKey)
    setShowKey(true)

    if (typeof window !== "undefined") {
      localStorage.setItem("api_key", newKey)
    }

    setShowRegenerateDialog(false)
    toast({
      title: t("settings.regenerateKeySuccess"),
      description: t("settings.regenerateKeySuccessDescription"),
    })
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: t("settings.keyCopied"),
    })
  }

  const displayedKey = showKey ? apiKey : apiKey.replace(/./g, "•")

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <SettingsSection title={t("settings.apiKey")} icon={Key}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">{t("settings.apiKeyLabel")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type="text"
                  placeholder="sk-..."
                  value={displayedKey}
                  readOnly
                  className="pr-20 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)} className="h-7 w-7 p-0">
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {apiKey && (
                    <Button variant="ghost" size="sm" onClick={handleCopyKey} className="h-7 w-7 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowRegenerateDialog(true)} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("settings.regenerateKey")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{t("settings.apiKeyDescription")}</p>
          </div>
        </div>
      </SettingsSection>

      <RegenerateKeyDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        onConfirm={handleRegenerateKey}
      />
    </div>
  )
}
