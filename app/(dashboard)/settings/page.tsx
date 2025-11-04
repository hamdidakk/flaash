"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { SettingsSection } from "@/components/dashboard/settings-section"
import { RegenerateKeyDialog } from "@/components/settings/regenerate-key-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { projectsMock, organizationsMock, formatDisplayDateShort } from "@/lib/mock-data"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()

  const initialProjectId = projectsMock[0]?.id ?? ""
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [isKeyVisible, setIsKeyVisible] = useState(false)
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

  const displayedKey = keyState && !keyState.locked && isKeyVisible ? keyState.key : keyState ? "••••••••••••••••" : ""

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <SettingsSection title={t("settings.apiKey")} icon={Key}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("settings.projectLabel")}</Label>
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
            </div>
            {activeOrganization && (
              <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{activeOrganization.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeOrganization.plan} • {activeOrganization.members} {t("settings.members")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={keyState?.locked ? "outline" : "default"}>
                {keyState?.locked ? t("settings.locked") : t("settings.unlocked")}
              </Badge>
              {keyState?.lastRotated && (
                <span className="text-xs text-muted-foreground">
                  {t("settings.lastRotated")} {formatDisplayDateShort(keyState.lastRotated)}
                </span>
              )}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">{t("settings.apiKeyLabel")}</Label>
            <div className="flex gap-2">
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
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
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
            </div>
            <p className="text-sm text-muted-foreground">{t("settings.apiKeyDescription")}</p>
            {keyState?.locked && (
              <p className="text-xs text-muted-foreground">{t("settings.lockedHint")}</p>
            )}
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
