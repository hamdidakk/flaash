"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { FolderOpen, Plus, Settings, Trash2, FileText, MessageSquare } from "lucide-react"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const [selectedOrg, setSelectedOrg] = useState("Acme Corp")

  const projects = [
    {
      id: 1,
      name: "Customer Support KB",
      organization: "Acme Corp",
      documents: 45,
      queries: 1234,
      status: "active",
      apiKey: "sk-proj-abc123...",
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      name: "Product Documentation",
      organization: "Acme Corp",
      documents: 128,
      queries: 3456,
      status: "active",
      apiKey: "sk-proj-def456...",
      createdAt: "2025-01-05",
    },
    {
      id: 3,
      name: "Internal Wiki",
      organization: "Tech Startup",
      documents: 23,
      queries: 567,
      status: "active",
      apiKey: "sk-proj-ghi789...",
      createdAt: "2025-01-12",
    },
  ]

  const filteredProjects = projects.filter((p) => p.organization === selectedOrg)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("projects.title")}
        description={t("projects.description")}
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("projects.create")}
          </Button>
        }
      />

      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.organization}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("projects.documents")}</p>
                  <p className="font-semibold">{project.documents}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("projects.queries")}</p>
                  <p className="font-semibold">{project.queries}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("projects.apiKey")}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">{project.apiKey}</code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("projects.created")}</p>
                <p className="text-sm">{project.createdAt}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
