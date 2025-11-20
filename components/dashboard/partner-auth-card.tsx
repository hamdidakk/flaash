"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ShieldCheck, KeyRound, RefreshCw, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import { usePartnerAuthStore } from "@/store/partner-auth-store"
import { useToast } from "@/hooks/use-toast"
import { normalizeScopes } from "@/lib/partner-auth"
import { ThrottlingAlert } from "@/components/error/throttling-alert"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

const formatExpiration = (timestamp?: number) => {
  if (!timestamp) return "—"
  return new Date(timestamp).toLocaleString()
}

export function PartnerAuthCard() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { config, token, status, error, throttled, hydrate, saveConfig, authenticate, refresh, clear } = usePartnerAuthStore()
  const [localConfig, setLocalConfig] = useState({
    partnerId: "",
    partnerSecret: "",
    scopes: "",
    audience: "",
  })
  const [isTesting, setIsTesting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (config) {
      setLocalConfig({
        partnerId: config.partnerId,
        partnerSecret: config.partnerSecret,
        scopes: normalizeScopes(config.scopes) ?? "",
        audience: config.audience ?? "",
      })
    }
  }, [config?.partnerId, config?.partnerSecret, config?.scopes, config?.audience])

  const handleInputChange = (field: keyof typeof localConfig) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalConfig((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const isConfigValid = localConfig.partnerId.trim().length > 0 && localConfig.partnerSecret.trim().length > 0

  const persistConfig = () => {
    if (!isConfigValid) {
      toast({
        title: t("partnerAuth.form.invalid"),
        variant: "destructive",
      })
      return
    }
    saveConfig({
      partnerId: localConfig.partnerId.trim(),
      partnerSecret: localConfig.partnerSecret.trim(),
      scopes: localConfig.scopes,
      audience: localConfig.audience.trim() || undefined,
    })
    toast({ title: t("partnerAuth.form.saved") })
  }

  const testConnection = async () => {
    if (!isConfigValid) {
      toast({
        title: t("partnerAuth.form.invalid"),
        variant: "destructive",
      })
      return
    }
    setIsTesting(true)
    try {
      await authenticate({
        partnerId: localConfig.partnerId.trim(),
        partnerSecret: localConfig.partnerSecret.trim(),
        scopes: localConfig.scopes,
        audience: localConfig.audience.trim() || undefined,
      })
      toast({
        title: t("partnerAuth.actions.authSuccess"),
        description: t("partnerAuth.status.details"),
      })
    } catch (err) {
      toast({
        title: t("common.error"),
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleRefresh = async () => {
    setIsTesting(true)
    try {
      await refresh()
      toast({ title: t("partnerAuth.actions.refreshSuccess") })
    } catch (err) {
      toast({
        title: t("common.error"),
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleClear = useCallback(() => {
    clear()
    setLocalConfig({
      partnerId: "",
      partnerSecret: "",
      scopes: "",
      audience: "",
    })
    toast({ title: t("partnerAuth.actions.cleared") })
  }, [clear, t, toast])

  const statusBadge = useMemo(() => {
    if (status === "authenticated" && token?.accessToken) {
      return <Badge variant="default">{t("partnerAuth.status.connected")}</Badge>
    }
    if (status === "loading") {
      return <Badge variant="outline">{t("common.loading")}</Badge>
    }
    if (status === "error") {
      return <Badge variant="destructive">{t("partnerAuth.status.error")}</Badge>
    }
    return <Badge variant="secondary">{t("partnerAuth.status.disconnected")}</Badge>
  }, [status, token?.accessToken, t])

  return (
    <DashboardSectionCard
      title={t("partnerAuth.title")}
      description={t("partnerAuth.description")}
      icon={ShieldCheck}
      meta={
        <>
          {statusBadge}
          {token?.expiresAt ? (
            <span className="text-sm text-muted-foreground">
              {t("partnerAuth.status.expiresAt")} {formatExpiration(token.expiresAt)}
            </span>
          ) : null}
        </>
      }
    >
      {error && status === "error" ? (
        <Alert variant="destructive" className="dashboard-alert dashboard-alert--warning">
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {status === "error" && throttled ? <ThrottlingAlert reason={error} onRetry={testConnection} /> : null}

      <DashboardFormSection columns={2}>
        <DashboardFormField label={t("partnerAuth.form.partnerId")} htmlFor="partner-id" required>
          <Input
            id="partner-id"
            value={localConfig.partnerId}
            onChange={handleInputChange("partnerId")}
            placeholder="partner_xxx"
            autoComplete="off"
          />
        </DashboardFormField>
        <DashboardFormField label={t("partnerAuth.form.partnerSecret")} htmlFor="partner-secret" required>
          <div className="dashboard-form-stack--dense md:flex md:items-start md:gap-2">
            <Input
              id="partner-secret"
              type={showSecret ? "text" : "password"}
              value={localConfig.partnerSecret}
              onChange={handleInputChange("partnerSecret")}
              placeholder="••••••••"
              autoComplete="off"
            />
            <Button variant="outline" onClick={() => setShowSecret((prev) => !prev)}>
              {showSecret ? t("partnerAuth.form.hideSecret") : t("partnerAuth.form.showSecret")}
            </Button>
          </div>
        </DashboardFormField>
      </DashboardFormSection>

      <DashboardFormSection columns={1}>
        <DashboardFormField
          label={t("partnerAuth.form.scopes")}
          description={t("partnerAuth.form.scopesHint")}
          htmlFor="partner-scopes"
        >
          <Textarea
            id="partner-scopes"
            rows={3}
            value={localConfig.scopes}
            onChange={handleInputChange("scopes")}
            placeholder="dashboard:read dashboard:write"
          />
        </DashboardFormField>
        <DashboardFormField label={t("partnerAuth.form.audience")} htmlFor="partner-audience">
          <Input
            id="partner-audience"
            value={localConfig.audience}
            onChange={handleInputChange("audience")}
            placeholder="https://api.partner.com"
          />
        </DashboardFormField>
      </DashboardFormSection>

      <DashboardFormActions align="space-between">
        <div className="flex flex-wrap gap-3">
          <Button onClick={persistConfig}>
            <Save className="mr-2 h-4 w-4" />
            {t("partnerAuth.actions.save")}
          </Button>
          <Button variant="outline" onClick={testConnection} disabled={isTesting}>
            <KeyRound className="mr-2 h-4 w-4" />
            {isTesting && status === "loading" ? t("common.loading") : t("partnerAuth.actions.test")}
          </Button>
          <Button variant="secondary" onClick={handleRefresh} disabled={isTesting || status !== "authenticated"}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("partnerAuth.actions.refresh")}
          </Button>
        </div>
        <Button variant="ghost" className="text-destructive" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t("partnerAuth.actions.clear")}
        </Button>
      </DashboardFormActions>
    </DashboardSectionCard>
  )
}


