"use client"

import { useEffect, useMemo, useState } from "react"
import { Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import type { CreateApiKeyPayload } from "@/lib/api-keys"
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

type FormState = {
  owner: string
  scope: string
  rateLimit: string
  expiresAt: string
  notes: string
}

const defaultState: FormState = {
  owner: "",
  scope: "",
  rateLimit: "",
  expiresAt: "",
  notes: "",
}

interface ApiKeyCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateApiKeyPayload) => Promise<void>
  isSubmitting?: boolean
}

export function ApiKeyCreateDialog({ open, onOpenChange, onSubmit, isSubmitting }: ApiKeyCreateDialogProps) {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormState>(defaultState)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!open) {
      setForm(defaultState)
      setError("")
    }
  }, [open])

  const isValid = useMemo(() => form.owner.trim().length > 0 && form.scope.trim().length > 0, [form.owner, form.scope])

  const normalizeScope = (value: string): string => {
    // Le backend attend scope comme une string, même si plusieurs scopes sont séparés par des virgules
    // On nettoie les espaces mais on garde la string
    return value
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)
      .join(",")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValid) {
      setError(t("apiKeys.form.validation"))
      return
    }

    const payload: CreateApiKeyPayload = {
      owner: form.owner.trim(),
      scope: normalizeScope(form.scope),
    }

    if (form.rateLimit) {
      const parsed = Number(form.rateLimit)
      if (!Number.isNaN(parsed)) {
        payload.rate_limit = parsed
      }
    }

    if (form.expiresAt) {
      payload.expires_at = new Date(form.expiresAt).toISOString()
    }

    if (form.notes.trim()) {
      payload.notes = form.notes.trim()
    }

    try {
      await onSubmit(payload)
      setError("")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t("common.error"))
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            {t("apiKeys.form.title")}
          </DialogTitle>
          <DialogDescription>{t("apiKeys.form.description")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DashboardFormSection columns={1}>
            <DashboardFormField label={t("apiKeys.form.ownerLabel")} htmlFor="api-key-owner" required>
              <Input
                id="api-key-owner"
                value={form.owner}
                onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                required
                placeholder="Acme Corp"
              />
            </DashboardFormField>
            <DashboardFormField
              label={t("apiKeys.form.scopeLabel")}
              description={t("apiKeys.form.scopeHint")}
              htmlFor="api-key-scope"
              required
            >
              <Input
                id="api-key-scope"
                value={form.scope}
                onChange={(event) => setForm((prev) => ({ ...prev, scope: event.target.value }))}
                required
                placeholder="dashboard:read,dashboard:write"
              />
            </DashboardFormField>
          </DashboardFormSection>

          <DashboardFormSection columns={2}>
            <DashboardFormField label={t("apiKeys.form.rateLimitLabel")} htmlFor="api-key-rate-limit">
              <Input
                id="api-key-rate-limit"
                type="number"
                min="0"
                placeholder="120"
                value={form.rateLimit}
                onChange={(event) => setForm((prev) => ({ ...prev, rateLimit: event.target.value }))}
              />
            </DashboardFormField>
            <DashboardFormField label={t("apiKeys.form.expirationLabel")} htmlFor="api-key-expiration">
              <Input
                id="api-key-expiration"
                type="date"
                value={form.expiresAt}
                onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
              />
            </DashboardFormField>
          </DashboardFormSection>

          <DashboardFormSection columns={1}>
            <DashboardFormField label={t("apiKeys.form.notesLabel")} htmlFor="api-key-notes">
              <Textarea
                id="api-key-notes"
                rows={3}
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t("apiKeys.form.notesPlaceholder") ?? ""}
              />
            </DashboardFormField>
          </DashboardFormSection>

          {error && (
            <Alert variant={error.includes("404") || error.includes("non disponible") ? "default" : "destructive"} 
                   className={error.includes("404") || error.includes("non disponible") ? "border-yellow-500/50 bg-yellow-500/10" : ""}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <DashboardFormActions>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? t("common.loading") : t("apiKeys.form.submit")}
              </Button>
            </DashboardFormActions>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

