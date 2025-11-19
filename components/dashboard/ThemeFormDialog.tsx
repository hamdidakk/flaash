"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useErrorHandler } from "@/hooks/use-error-handler"
import {
  createThemeAdmin,
  updateThemeAdmin,
  type ThemeAdmin,
  type ThemePayload,
  type ThemeStat,
} from "@/lib/themes-admin-api"

type ThemeFormState = {
  title: string
  slug: string
  subtitle: string
  description: string
  excerpt: string
  tag: string
  icon: string
  stats: ThemeStat[]
  prompts: string[]
  display_order: number
  is_active: boolean
}

const createEmptyStat = (): ThemeStat => ({ label: "", value: "" })

const createDefaultState = (): ThemeFormState => ({
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  excerpt: "",
  tag: "",
  icon: "",
  stats: [createEmptyStat()],
  prompts: [""],
  display_order: 1,
  is_active: true,
})

const mapThemeToState = (theme: ThemeAdmin): ThemeFormState => ({
  title: theme.title ?? "",
  slug: theme.slug ?? "",
  subtitle: theme.subtitle ?? "",
  description: theme.description ?? "",
  excerpt: theme.excerpt ?? "",
  tag: theme.tag ?? "",
  icon: theme.icon ?? "",
  stats: theme.stats && theme.stats.length > 0 ? theme.stats : [createEmptyStat()],
  prompts: theme.prompts && theme.prompts.length > 0 ? theme.prompts : [""],
  display_order: theme.display_order ?? 1,
  is_active: theme.is_active ?? true,
})

type ThemeFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTheme?: ThemeAdmin | null
  onSaved?: () => Promise<void> | void
}

export function ThemeFormDialog({ open, onOpenChange, initialTheme, onSaved }: ThemeFormDialogProps) {
  const isEditing = Boolean(initialTheme)
  const [formState, setFormState] = useState<ThemeFormState>(createDefaultState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  useEffect(() => {
    if (open) {
      setFormState(initialTheme ? mapThemeToState(initialTheme) : createDefaultState())
    }
  }, [initialTheme, open])

  const stats = formState.stats
  const prompts = formState.prompts

  const updateState = <K extends keyof ThemeFormState>(key: K, value: ThemeFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const updateStat = (index: number, key: keyof ThemeStat, value: string) => {
    const next = stats.map((stat, idx) => (idx === index ? { ...stat, [key]: value } : stat))
    updateState("stats", next)
  }

  const updatePrompt = (index: number, value: string) => {
    const next = prompts.map((prompt, idx) => (idx === index ? value : prompt))
    updateState("prompts", next)
  }

  const payloadFromState = (): ThemePayload => ({
    title: formState.title.trim(),
    slug: formState.slug.trim(),
    subtitle: formState.subtitle.trim() || undefined,
    description: formState.description.trim() || undefined,
    excerpt: formState.excerpt.trim() || undefined,
    tag: formState.tag.trim() || undefined,
    icon: formState.icon.trim() || undefined,
    stats: stats
      .map((stat) => ({
        label: stat.label.trim(),
        value: stat.value.trim(),
      }))
      .filter((stat) => stat.label && stat.value),
    prompts: prompts.map((prompt) => prompt.trim()).filter(Boolean),
    display_order: Number(formState.display_order) || 1,
    is_active: formState.is_active,
  })

  const handleSubmit = async () => {
    if (!formState.title || !formState.slug) {
      toast({
        title: "Champs obligatoires",
        description: "Titre et slug sont requis.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    const payload = payloadFromState()
    try {
      if (isEditing && initialTheme) {
        const { slug: _slug, ...rest } = payload
        await updateThemeAdmin(initialTheme.slug, rest)
        toast({ title: "Thématique mise à jour" })
      } else {
        await createThemeAdmin(payload)
        toast({ title: "Thématique créée" })
      }
      onOpenChange(false)
      await onSaved?.()
    } catch (error) {
      handleError(error, { title: "Impossible d'enregistrer la thématique" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const dialogTitle = useMemo(
    () => (isEditing ? `Modifier ${initialTheme?.title ?? ""}` : "Nouvelle thématique"),
    [isEditing, initialTheme?.title],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations de la thématique."
              : "Définissez une nouvelle thématique pour la revue et l’agent."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme-title">Titre *</Label>
              <Input
                id="theme-title"
                value={formState.title}
                onChange={(e) => updateState("title", e.target.value)}
                placeholder="Ex: Futurs de société"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-slug">Slug *</Label>
              <Input
                id="theme-slug"
                value={formState.slug}
                onChange={(e) => updateState("slug", e.target.value)}
                placeholder="ex: futur-societe"
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme-subtitle">Sous-titre</Label>
              <Input
                id="theme-subtitle"
                value={formState.subtitle}
                onChange={(e) => updateState("subtitle", e.target.value)}
                placeholder="Une phrase d’accroche"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-tag">Tag / référence</Label>
              <Input
                id="theme-tag"
                value={formState.tag}
                onChange={(e) => updateState("tag", e.target.value)}
                placeholder="Numéro 06"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme-icon">Icône / emoji</Label>
              <Input
                id="theme-icon"
                value={formState.icon}
                onChange={(e) => updateState("icon", e.target.value)}
                placeholder="🌆"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-order">Ordre d’affichage</Label>
              <Input
                id="theme-order"
                type="number"
                value={formState.display_order}
                onChange={(e) => updateState("display_order", Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme-description">Présentation</Label>
            <Textarea
              id="theme-description"
              rows={3}
              value={formState.description}
              onChange={(e) => updateState("description", e.target.value)}
              placeholder="Texte utilisé côté admin ou fiche thème."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme-excerpt">Extrait public</Label>
            <Textarea
              id="theme-excerpt"
              rows={3}
              value={formState.excerpt}
              onChange={(e) => updateState("excerpt", e.target.value)}
              placeholder="Résumé affiché sur le site public."
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">Stats</h3>
                <p className="text-xs text-muted-foreground">Label + valeur affichés sous forme de compteurs.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateState("stats", [...stats, createEmptyStat()])}
              >
                <Plus className="mr-1 h-4 w-4" /> Ajouter
              </Button>
            </div>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      placeholder="Articles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valeur</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      placeholder="18"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={() =>
                        updateState(
                          "stats",
                          stats.length > 1 ? stats.filter((_, idx) => idx !== index) : [createEmptyStat()],
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">Prompts</h3>
                <p className="text-xs text-muted-foreground">Questions prêtes à envoyer dans le chat public.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateState("prompts", [...prompts, ""])}
              >
                <Plus className="mr-1 h-4 w-4" /> Ajouter
              </Button>
            </div>
            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <div key={`prompt-${index}`} className="flex gap-3">
                  <Textarea
                    value={prompt}
                    onChange={(e) => updatePrompt(index, e.target.value)}
                    placeholder="Ex: Quelles sont les coopératives énergétiques émergentes ?"
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 text-muted-foreground"
                    onClick={() =>
                      updateState(
                        "prompts",
                        prompts.length > 1 ? prompts.filter((_, idx) => idx !== index) : [""],
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Visible côté public</p>
              <p className="text-xs text-muted-foreground">Contrôle le champ is_active de l’API.</p>
            </div>
            <Switch checked={formState.is_active} onCheckedChange={(checked) => updateState("is_active", checked)} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement…" : isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

