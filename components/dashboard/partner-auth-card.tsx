"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ShieldCheck, KeyRound, RefreshCw, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import { usePartnerAuthStore } from "@/store/partner-auth-store"
import { useToast } from "@/hooks/use-toast"
import { normalizeScopes } from "@/lib/partner-auth"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

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
      return <Badge variant="success">{t("partnerAuth.status.connected")}</Badge>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {t("partnerAuth.title")}
        </CardTitle>
        <CardDescription>{t("partnerAuth.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {statusBadge}
          {token?.expiresAt && (
            <span className="text-sm text-muted-foreground">
              {t("partnerAuth.status.expiresAt")} {formatExpiration(token.expiresAt)}
            </span>
          )}
        </div>

        {error && status === "error" && (
          <Alert variant="destructive">
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {status === "error" && throttled && <ThrottlingAlert reason={error} onRetry={testConnection} />}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="partner-id">{t("partnerAuth.form.partnerId")}</Label>
            <Input
              id="partner-id"
              value={localConfig.partnerId}
              onChange={handleInputChange("partnerId")}
              placeholder="partner_xxx"
              autoComplete="off"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="partner-secret">{t("partnerAuth.form.partnerSecret")}</Label>
            <div className="flex gap-2">
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
          </div>

          <div className="space-y-3">
            <Label htmlFor="partner-scopes">{t("partnerAuth.form.scopes")}</Label>
            <Textarea
              id="partner-scopes"
              rows={3}
              value={localConfig.scopes}
              onChange={handleInputChange("scopes")}
              placeholder="dashboard:read dashboard:write"
            />
            <p className="text-xs text-muted-foreground">{t("partnerAuth.form.scopesHint")}</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="partner-audience">{t("partnerAuth.form.audience")}</Label>
            <Input
              id="partner-audience"
              value={localConfig.audience}
              onChange={handleInputChange("audience")}
              placeholder="https://api.partner.com"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
      </CardFooter>
    </Card>
  )
}


