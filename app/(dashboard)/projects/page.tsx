"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import { FolderOpen, Plus, ShieldCheck, FileText, MessageSquare, KeyRound, Clock } from "lucide-react"
import { organizationsMock, projectsMock, formatDisplayDateShort } from "@/lib/mock-data"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const [selectedOrgId, setSelectedOrgId] = useState(organizationsMock[0]?.id ?? "")

  const activeOrganization = useMemo(
    () => organizationsMock.find((org) => org.id === selectedOrgId),
    [selectedOrgId],
  )

  const filteredProjects = useMemo(
    () => projectsMock.filter((project) => project.organizationId === selectedOrgId),
    [selectedOrgId],
  )

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

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("projects.organization")}</p>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {organizationsMock.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{org.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {org.plan} • {org.projects} projects • {org.members} members
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {activeOrganization && (
              <Badge variant="outline" className="w-fit">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                {t("projects.tenantIsolation")}
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {filteredProjects.map((project) => {
              const maskedKey = `sk-****-****-${project.apiKeyLastFour}`

              return (
                <Card key={project.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activeOrganization?.name} • {t("projects.created")} {formatDisplayDateShort(project.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("projects.apiKey")}</p>
                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{maskedKey}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("projects.lastActivity")}</p>
                        <p className="text-xs">{formatDisplayDateShort(project.lastActivity)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                      <div className="text-xs text-muted-foreground">{t("projects.keyIsolation")}</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href="/settings">
                          <ShieldCheck className="h-4 w-4" />
                            {t("projects.manageKeys")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
    </div>
  )
}
