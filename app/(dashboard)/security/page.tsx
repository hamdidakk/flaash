"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, RefreshCw, RotateCcw, Trash2, Copy } from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiKeyCreateDialog } from "@/components/api-keys/api-key-create-dialog"
import { useApiKeysStore } from "@/store/api-keys-store"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { useErrorHandler } from "@/hooks/use-error-handler"
import type { ApiKeyRecord, ApiKeyStatus, CreateApiKeyPayload } from "@/lib/api-keys"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

const formatDateTime = (value?: string | null) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

const scopeToString = (scope?: string | string[]) => {
  if (!scope) return "—"
  if (Array.isArray(scope)) {
    return scope.join(", ")
  }
  return scope
}

const resolveStatus = (record: ApiKeyRecord): ApiKeyStatus => {
  if (record.status) return record.status
  return record.is_active ? "active" : "inactive"
}

const statusBadgeVariant = (status: ApiKeyStatus) => {
  if (status === "active") return "default"
  if (status === "revoked") return "destructive"
  return "secondary"
}

export default function ApiKeysSecurityPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const {
    keys,
    totalKeys,
    events,
    totalEvents,
    isLoadingKeys,
    isLoadingEvents,
    fetchKeys,
    fetchEvents,
    createKey,
    rotateKey,
    revokeKey,
    filters,
    setFilters,
    error,
    clearError,
    lastCreatedSecret,
    clearLastSecret,
    throttled,
  } = useApiKeysStore()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [rotatingId, setRotatingId] = useState<string | number | null>(null)
  const [revokingId, setRevokingId] = useState<string | number | null>(null)

  // Vérifier si l'endpoint n'est pas disponible (404)
  const isEndpointUnavailable = !!(error && (error.includes("404") || error.includes("non disponible")))

  useEffect(() => {
    setSearch(filters?.search ?? "")
    setStatusFilter(
      typeof filters?.is_active === "boolean" ? (filters.is_active ? "active" : "inactive") : "all",
    )
  }, [filters?.search, filters?.is_active])

  useEffect(() => {
    fetchKeys().catch(() => undefined)
    fetchEvents().catch(() => undefined)
  }, [fetchKeys, fetchEvents])

  const activeKeysCount = useMemo(
    () => keys.filter((record) => resolveStatus(record) === "active").length,
    [keys],
  )
  const inactiveKeysCount = useMemo(
    () => keys.filter((record) => resolveStatus(record) !== "active").length,
    [keys],
  )

  const applyFilters = () => {
    const nextFilters = {
      ...filters,
      search: search.trim() || undefined,
      is_active: statusFilter === "all" ? undefined : statusFilter === "active",
      offset: 0,
    }
    setFilters(nextFilters)
    fetchKeys(nextFilters).catch(() => undefined)
  }

  const resetFilters = () => {
    setSearch("")
    setStatusFilter("all")
    const nextFilters = {
      ...filters,
      search: undefined,
      is_active: undefined,
      offset: 0,
    }
    setFilters(nextFilters)
    fetchKeys(nextFilters).catch(() => undefined)
  }

  const handleCreate = async (payload: CreateApiKeyPayload) => {
    setIsCreating(true)
    try {
      await createKey(payload)
      toast({
        title: t("apiKeys.actions.createSuccess"),
      })
      setIsCreateOpen(false)
    } catch (err) {
      handleError(err, { title: t("apiKeys.actions.create") })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRotate = async (record: ApiKeyRecord) => {
    setRotatingId(record.id)
    try {
      await rotateKey(record.id)
      toast({ title: t("apiKeys.actions.rotateSuccess") })
    } catch (err) {
      handleError(err, { title: t("apiKeys.actions.rotate") })
    } finally {
      setRotatingId(null)
    }
  }

  const handleRevoke = async (record: ApiKeyRecord) => {
    if (!window.confirm(t("apiKeys.actions.revokeConfirm"))) {
      return
    }
    setRevokingId(record.id)
    try {
      await revokeKey(record.id)
      toast({ title: t("apiKeys.actions.revokeSuccess") })
    } catch (err) {
      handleError(err, { title: t("apiKeys.actions.revoke") })
    } finally {
      setRevokingId(null)
    }
  }

  const handleCopySecret = async () => {
    const secret = lastCreatedSecret?.plain_text ?? lastCreatedSecret?.token
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret)
      toast({ title: t("apiKeys.secret.copied") })
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("apiKeys.page.title")}
        description={t("apiKeys.page.description")}
        actions={
          <Button onClick={() => setIsCreateOpen(true)} disabled={isEndpointUnavailable}>
            <Plus className="mr-2 h-4 w-4" />
            {t("apiKeys.actions.create")}
          </Button>
        }
      />

      {throttled && (
        <ThrottlingAlert reason={error} onRetry={() => fetchKeys().catch(() => undefined)} />
      )}
      {error && !throttled && !isEndpointUnavailable && (
        <Alert variant="destructive" className="flex items-start justify-between gap-4">
          <div>
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={clearError}>
            {t("common.dismiss")}
          </Button>
        </Alert>
      )}
      {isEndpointUnavailable && (
        <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTitle>{t("apiKeys.notAvailable.title")}</AlertTitle>
          <AlertDescription>{t("apiKeys.notAvailable.description")}</AlertDescription>
        </Alert>
      )}

      {lastCreatedSecret && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>{t("apiKeys.secret.title")}</CardTitle>
              <CardDescription>{t("apiKeys.secret.description")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearLastSecret}>
              {t("apiKeys.secret.dismiss")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {t("apiKeys.secret.valueLabel")}
              </p>
              <div className="mt-1 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 font-mono text-sm">
                <span className="flex-1 break-all">
                  {lastCreatedSecret.plain_text ?? lastCreatedSecret.token ?? "—"}
                </span>
                <Button variant="ghost" size="icon" onClick={handleCopySecret}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">{t("apiKeys.secret.copy")}</span>
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t("apiKeys.secret.warning")}</p>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">{t("apiKeys.list.columns.owner")}</p>
                <p className="font-medium">{lastCreatedSecret.key.owner}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">{t("apiKeys.list.columns.scope")}</p>
                <p className="font-medium">{scopeToString(lastCreatedSecret.key.scope)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>{t("apiKeys.list.stats.total") ?? "Total keys"}</CardDescription>
            <CardTitle className="text-3xl font-semibold">{totalKeys}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("apiKeys.list.stats.active") ?? "Active"}</CardDescription>
            <CardTitle className="text-3xl font-semibold">{activeKeysCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("apiKeys.list.stats.inactive") ?? "Inactive"}</CardDescription>
            <CardTitle className="text-3xl font-semibold">{inactiveKeysCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("apiKeys.events.stats.total") ?? "Events"}</CardDescription>
            <CardTitle className="text-3xl font-semibold">{totalEvents}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{t("apiKeys.list.title")}</CardTitle>
            <CardDescription>{t("apiKeys.list.description")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchKeys().catch(() => undefined)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("apiKeys.list.refresh")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto_auto]">
            <div className="space-y-2">
              <Label htmlFor="api-key-search">{t("common.search")}</Label>
              <Input
                id="api-key-search"
                placeholder={t("apiKeys.list.searchPlaceholder")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("apiKeys.list.statusFilterLabel")}</Label>
              <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("apiKeys.list.status.all")}</SelectItem>
                  <SelectItem value="active">{t("apiKeys.list.status.active")}</SelectItem>
                  <SelectItem value="inactive">{t("apiKeys.list.status.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={applyFilters}>
                {t("common.apply")}
              </Button>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" className="w-full" onClick={resetFilters}>
                {t("common.reset")}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.owner")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.scope")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.rateLimit")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.status")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.lastUsed")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.lastRotation")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.list.columns.expiresAt")}</th>
                  <th className="px-4 py-3 text-right font-medium">{t("apiKeys.list.columns.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingKeys &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-4 py-3" colSpan={8}>
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))}
                {!isLoadingKeys && keys.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={8}>
                      {isEndpointUnavailable ? (
                        <div className="space-y-2">
                          <p className="font-medium">{t("apiKeys.notAvailable.title")}</p>
                          <p className="text-xs">{t("apiKeys.notAvailable.description")}</p>
                        </div>
                      ) : (
                        t("apiKeys.list.empty")
                      )}
                    </td>
                  </tr>
                )}
                {!isLoadingKeys &&
                  keys.map((record) => {
                    const status = resolveStatus(record)
                    return (
                      <tr key={record.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{record.owner}</div>
                          {record.label && <div className="text-xs text-muted-foreground">{record.label}</div>}
                        </td>
                        <td className="px-4 py-3">{scopeToString(record.scope)}</td>
                        <td className="px-4 py-3">
                          {typeof record.rate_limit === "number" ? record.rate_limit : t("apiKeys.list.unlimited")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadgeVariant(status)}>{t(`apiKeys.status.${status}`)}</Badge>
                        </td>
                        <td className="px-4 py-3">{formatDateTime(record.last_used_at)}</td>
                        <td className="px-4 py-3">{formatDateTime(record.last_rotated_at)}</td>
                        <td className="px-4 py-3">{formatDateTime(record.expires_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRotate(record)}
                              disabled={rotatingId === record.id}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {rotatingId === record.id ? t("common.loading") : t("apiKeys.actions.rotate")}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevoke(record)}
                              disabled={revokingId === record.id || status === "revoked"}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {revokingId === record.id ? t("common.loading") : t("apiKeys.actions.revoke")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{t("apiKeys.events.title")}</CardTitle>
            <CardDescription>{t("apiKeys.events.description")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchEvents().catch(() => undefined)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("apiKeys.events.refresh")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.events.columns.event")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.events.columns.owner")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.events.columns.ipAddress")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.events.columns.userAgent")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("apiKeys.events.columns.timestamp")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingEvents &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`event-skeleton-${index}`}>
                      <td className="px-4 py-3" colSpan={5}>
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))}
                {!isLoadingEvents && events.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                      {isEndpointUnavailable ? (
                        <div className="space-y-2">
                          <p className="font-medium">{t("apiKeys.events.notAvailable")}</p>
                          <p className="text-xs">{t("apiKeys.events.notAvailableDescription")}</p>
                        </div>
                      ) : (
                        t("apiKeys.events.empty")
                      )}
                    </td>
                  </tr>
                )}
                {!isLoadingEvents &&
                  events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="uppercase">
                          {event.event_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{event.api_key_owner ?? "—"}</td>
                      <td className="px-4 py-3">{event.ip_address ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-2 max-w-xs text-muted-foreground">{event.user_agent ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">{formatDateTime(event.created_at)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ApiKeyCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />
    </div>
  )
}



