"use client"

import { useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Building2, Plus, Users, FolderOpen, ShieldCheck, KeyRound } from "lucide-react"
// Backend integration pending for organizations/projects; render with empty data
const organizationsMock: Array<{ id: string; name: string; plan: string; members: number; updatedAt: string }> = []
const projectsMock: Array<{ id: string; organizationId: string }> = []
const formatDisplayDateShort = (value: string) => new Date(value).toLocaleDateString()

export default function OrganizationsPage() {
  const { t } = useLanguage()

  const organizations = useMemo(() => organizationsMock, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("organizations.title")}
        description={t("organizations.description")}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("organizations.create")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {organizations.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No organizations found.</Card>
        ) : (
        organizations.map((org) => {
          const projectCount = projectsMock.filter((project) => project.organizationId === org.id).length
          const totalMembers = org.members
          const lastUpdated = formatDisplayDateShort(org.updatedAt)

          return (
            <Card key={org.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{org.name}</h3>
                    <p className="text-xs text-muted-foreground">{t("organizations.lastUpdated")} {lastUpdated}</p>
                  </div>
                </div>
                <Badge>{org.plan}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {totalMembers} {t("settings.members")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  <span>
                    {projectCount} {t("projects.title").toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>{t("organizations.isolation")}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="/settings">
                    <KeyRound className="h-4 w-4" />
                    {t("projects.manageKeys")}
                  </a>
                </Button>
              </div>
            </Card>
          )
        }))
        }
      </div>
    </div>
  )
}
