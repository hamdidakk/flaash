"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { listThemesAdmin, type ThemeAdmin } from "@/lib/themes-admin-api"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { RefreshCw, Plus } from "lucide-react"
import { ThemeFormDialog } from "@/components/dashboard/ThemeFormDialog"
import { DashboardTable, type DashboardTableColumn } from "@/components/dashboard/DashboardTable"

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

  const columns: DashboardTableColumn<ThemeAdmin>[] = [
    {
      key: "title",
      header: "Titre",
      render: (theme) => (
        <div>
          <div className="font-medium text-foreground">{theme.title}</div>
          {theme.subtitle ? <div className="text-xs text-muted-foreground">{theme.subtitle}</div> : null}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      className: "font-mono text-xs text-muted-foreground",
    },
    {
      key: "display_order",
      header: "Ordre",
      width: "80px",
    },
    {
      key: "is_active",
      header: "Statut",
      render: (theme) => (
        <Badge variant={theme.is_active ? "default" : "secondary"}>{theme.is_active ? "Publié" : "Masqué"}</Badge>
      ),
    },
    {
      key: "updated_at",
      header: "Mise à jour",
      className: "text-muted-foreground",
      render: (theme) => (theme.updated_at ? countryFormatter.format(new Date(theme.updated_at)) : "—"),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (theme) => (
        <Button variant="ghost" size="sm" onClick={() => handleEditTheme(theme)}>
          Éditer
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Thématiques"
        description="Administrez les dossiers éditoriaux utilisés sur le site public et dans l’agent."
        actions={
          <div className="flex flex-wrap gap-2">
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
        <DashboardTable
          columns={columns}
          rows={themes}
          isLoading={isLoading}
          getRowKey={(theme) => theme.slug}
          emptyState={{
            title: "Aucune thématique pour l’instant.",
            description: "Cliquez sur “Nouvelle thématique” pour commencer.",
          }}
        />
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

