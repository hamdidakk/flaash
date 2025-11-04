"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Building2, Plus, Users, FolderOpen } from "lucide-react"

export default function OrganizationsPage() {
  const { t } = useLanguage()

  const organizations = [
    { id: 1, name: "Acme Corp", role: "Admin", members: 12, projects: 5, plan: "Enterprise" },
    { id: 2, name: "Tech Startup", role: "User", members: 3, projects: 2, plan: "Pro" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("organizations.title")}
        description={t("organizations.description")}
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("organizations.create")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {organizations.map((org) => (
          <Card key={org.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{org.name}</h3>
                  <Badge variant="secondary">{org.role}</Badge>
                </div>
              </div>
              <Badge>{org.plan}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{org.members} members</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderOpen className="h-4 w-4" />
                <span>{org.projects} projects</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
