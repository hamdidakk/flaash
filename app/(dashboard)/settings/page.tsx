"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { SettingsSection } from "@/components/dashboard/settings-section"
import { RegenerateKeyDialog } from "@/components/settings/regenerate-key-dialog"
import { PartnerAuthCard } from "@/components/dashboard/partner-auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { Key, RefreshCw, Copy, Eye, EyeOff, Lock, Unlock, Shield } from "lucide-react"
// Replace mock projects/organizations with empty placeholders; keys UI remains self-contained
const projectsMock: Array<{ id: string; name: string; organizationId: string; apiKey: string; lastActivity: string }> = []
const organizationsMock: Array<{ id: string; name: string; plan: string; members: number }> = []
const formatDisplayDateShort = (value: string) => new Date(value).toLocaleDateString()
import {
  getStoredApiBaseUrl,
  getStoredApiKey,
  setStoredApiBaseUrl,
  setStoredApiKey,
  getApiIntegrationStatus,
} from "@/lib/dakkom-api"
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()

  const initialProjectId = projectsMock[0]?.id ?? ""
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const [apiBaseUrl, setApiBaseUrl] = useState("")
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [isApiConfigHydrated, setIsApiConfigHydrated] = useState(false)
  const [projectKeys, setProjectKeys] = useState(() =>
    projectsMock.reduce(
      (acc, project) => {
        acc[project.id] = {
          key: project.apiKey,
          locked: true,
          lastRotated: project.lastActivity,
        }
        return acc
      },
      {} as Record<string, { key: string; locked: boolean; lastRotated: string }>,
    ),
  )

  const activeProject = useMemo(() => projectsMock.find((project) => project.id === selectedProjectId), [selectedProjectId])
  const activeOrganization = useMemo(
    () => organizationsMock.find((org) => org.id === activeProject?.organizationId),
    [activeProject?.organizationId],
  )
  const keyState = projectKeys[selectedProjectId]

  useEffect(() => {
    setIsKeyVisible(false)
  }, [selectedProjectId])

  useEffect(() => {
    if (typeof window === "undefined") return
    setApiBaseUrl(getStoredApiBaseUrl())
    setApiKeyInput(getStoredApiKey())
    setIsApiConfigHydrated(true)
  }, [])

  const handleUnlock = () => {
    if (!keyState) return
    setProjectKeys((prev) => ({
      ...prev,
      [selectedProjectId]: { ...prev[selectedProjectId], locked: false },
    }))
    setIsKeyVisible(true)
    toast({
      title: t("settings.vaultUnlocked"),
      description: t("settings.unlockDescription"),
    })
  }

  const handleLock = () => {
    if (!keyState) return
    setProjectKeys((prev) => ({
      ...prev,
      [selectedProjectId]: { ...prev[selectedProjectId], locked: true },
    }))
    setIsKeyVisible(false)
    toast({
      title: t("settings.vaultLocked"),
    })
  }

  const handleRegenerateKey = () => {
    if (!keyState) return
    const newKey = `sk-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`
    const timestamp = new Date().toISOString()
    setProjectKeys((prev) => ({
      ...prev,
      [selectedProjectId]: { key: newKey, locked: false, lastRotated: timestamp },
    }))
    setShowRegenerateDialog(false)
    setIsKeyVisible(true)
    toast({
      title: t("settings.regenerateKeySuccess"),
      description: t("settings.regenerateKeySuccessDescription"),
    })
  }

  const handleCopyKey = () => {
    if (!keyState || keyState.locked) {
      toast({
        title: t("settings.vaultLocked"),
        description: t("settings.lockedHint"),
        variant: "destructive",
      })
      return
    }
    navigator.clipboard.writeText(keyState.key)
    toast({
      title: t("settings.keyCopied"),
    })
  }

  const handleSaveApiConfig = () => {
    setStoredApiBaseUrl(apiBaseUrl.trim())
    setStoredApiKey(apiKeyInput.trim())
    toast({
      title: t("settings.apiConfig.saved"),
      description: t("settings.apiConfig.savedDescription"),
    })
  }

  const apiConfigStatus = useMemo(() => {
    if (!isApiConfigHydrated) {
      return { baseUrl: "", hasApiKey: false, isConfigured: false }
    }
    return getApiIntegrationStatus()
  }, [apiBaseUrl, apiKeyInput, isApiConfigHydrated])

  const displayedKey = keyState && !keyState.locked && isKeyVisible ? keyState.key : keyState ? "••••••••••••••••" : ""

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={t("settings.title")} description={t("settings.description")} />

      <SettingsSection title={t("settings.apiConfig.title") ?? "Dakkom API"} icon={Key}>
        <div className="space-y-6">
          <DashboardFormSection columns={2}>
            <DashboardFormField
              label={t("settings.apiConfig.baseUrlLabel")}
              description={t("settings.apiConfig.baseUrlDescription")}
              htmlFor="dakkom-base-url"
            >
              <Input
                id="dakkom-base-url"
                type="url"
                placeholder={t("settings.apiConfig.baseUrlPlaceholder")}
                value={apiBaseUrl}
                onChange={(event) => setApiBaseUrl(event.target.value)}
              />
            </DashboardFormField>
            <DashboardFormField
              label={t("settings.apiConfig.apiKeyLabel")}
              description={t("settings.apiConfig.apiKeyDescription")}
              htmlFor="dakkom-api-key"
            >
              <Input
                id="dakkom-api-key"
                type="text"
                placeholder={t("settings.apiConfig.apiKeyPlaceholder")}
                value={apiKeyInput}
                onChange={(event) => setApiKeyInput(event.target.value)}
              />
            </DashboardFormField>
          </DashboardFormSection>

          <DashboardFormActions align="space-between" className="items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={apiConfigStatus.isConfigured ? "default" : "outline"}>
                {apiConfigStatus.isConfigured ? t("settings.unlocked") : t("settings.locked")}
              </Badge>
              {apiConfigStatus.baseUrl ? <span className="truncate">{apiConfigStatus.baseUrl}</span> : null}
            </div>
            <Button onClick={handleSaveApiConfig}>{t("settings.apiConfig.save")}</Button>
          </DashboardFormActions>
        </div>
      </SettingsSection>

      <SettingsSection title={t("settings.apiKey")} icon={Key}>
        <div className="space-y-6">
          <DashboardFormSection columns={2}>
            <DashboardFormField label={t("settings.projectLabel")}>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectsMock.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {organizationsMock.find((org) => org.id === project.organizationId)?.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DashboardFormField>
            {activeOrganization ? (
              <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{activeOrganization.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeOrganization.plan} • {activeOrganization.members} {t("settings.members")}
                  </p>
                </div>
              </div>
            ) : null}
          </DashboardFormSection>

          <DashboardFormActions align="space-between" className="items-center">
            <div className="flex items-center gap-2">
              <Badge variant={keyState?.locked ? "outline" : "default"}>
                {keyState?.locked ? t("settings.locked") : t("settings.unlocked")}
              </Badge>
              {keyState?.lastRotated ? (
                <span className="text-xs text-muted-foreground">
                  {t("settings.lastRotated")} {formatDisplayDateShort(keyState.lastRotated)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button variant={keyState?.locked ? "default" : "outline"} size="sm" onClick={keyState?.locked ? handleUnlock : handleLock}>
                {keyState?.locked ? <Unlock className="mr-1 h-4 w-4" /> : <Lock className="mr-1 h-4 w-4" />}
                {keyState?.locked ? t("settings.unlockVault") : t("settings.lockVault")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowRegenerateDialog(true)}
                disabled={keyState?.locked}
              >
                <RefreshCw className="h-4 w-4" />
                {t("settings.regenerateKey")}
              </Button>
            </div>
          </DashboardFormActions>

          <DashboardFormSection columns="none">
            <DashboardFormField
              label={t("settings.apiKeyLabel")}
              description={t("settings.apiKeyDescription")}
              htmlFor="apiKey"
            >
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type="text"
                  placeholder={keyState?.locked ? t("settings.vaultLocked") : "sk-..."}
                  value={displayedKey}
                  readOnly
                  disabled={!keyState}
                  className="pr-20 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsKeyVisible((prev) => !prev)}
                    className="h-7 w-7 p-0"
                    disabled={!keyState || keyState.locked}
                  >
                    {isKeyVisible && !keyState?.locked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyKey}
                    className="h-7 w-7 p-0"
                    disabled={!keyState || keyState.locked}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DashboardFormField>
            {keyState?.locked ? <p className="text-xs text-muted-foreground">{t("settings.lockedHint")}</p> : null}
          </DashboardFormSection>
        </div>
      </SettingsSection>

      <SettingsSection title={t("partnerAuth.sectionTitle")} icon={Shield}>
        <PartnerAuthCard />
      </SettingsSection>

      <RegenerateKeyDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog} onConfirm={handleRegenerateKey} />
    </div>
  )
}

