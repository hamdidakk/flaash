"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { listThemesAdmin, type ThemeAdmin } from "@/lib/themes-admin-api"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Plus } from "lucide-react"
import { ThemeFormDialog } from "@/components/dashboard/ThemeFormDialog"

export default function ThemesAdminPage() {
  const { handleError } = useErrorHandler()
  const [themes, setThemes] = useState<ThemeAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<ThemeAdmin | null>(null)

  const loadThemes = async () => {
    try {
      setIsRefreshing(true)
      const data = await listThemesAdmin(true)
      setThemes(data.sort((a, b) => a.display_order - b.display_order))
    } catch (error) {
      handleError(error, { title: "Impossible de charger les thématiques" })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadThemes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNewTheme = () => {
    setEditingTheme(null)
    setIsDialogOpen(true)
  }

  const handleEditTheme = (theme: ThemeAdmin) => {
    setEditingTheme(theme)
    setIsDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingTheme(null)
    }
  }

  const countryFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thématiques"
        description="Administrez les dossiers éditoriaux utilisés sur le site public et dans l’agent."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void loadThemes()} disabled={isRefreshing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
            <Button onClick={handleNewTheme}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle thématique
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-base font-semibold">Liste des thématiques</h2>
        </div>
        {isLoading ? (
          <div className="space-y-2 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={`skeleton-${idx}`} className="h-12 w-full" />
            ))}
          </div>
        ) : themes.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            Aucune thématique pour l’instant. Cliquez sur “Nouvelle thématique” pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3">Titre</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Ordre</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Mise à jour</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {themes.map((theme) => (
                  <tr key={theme.slug} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{theme.title}</div>
                      {theme.subtitle ? <div className="text-xs text-muted-foreground">{theme.subtitle}</div> : null}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{theme.slug}</td>
                    <td className="px-4 py-4">{theme.display_order}</td>
                    <td className="px-4 py-4">
                      <Badge variant={theme.is_active ? "default" : "secondary"}>
                        {theme.is_active ? "Publié" : "Masqué"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {theme.updated_at ? countryFormatter.format(new Date(theme.updated_at)) : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTheme(theme)}>
                        Éditer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ThemeFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        initialTheme={editingTheme}
        onSaved={() => loadThemes()}
      />
    </div>
  )
}

