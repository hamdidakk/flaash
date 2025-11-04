"use client"

import { PageHeader } from "@/components/page-header"
import { UsersTable } from "@/components/dashboard/users-table"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { UserPlus } from "lucide-react"

export default function UsersPage() {
  const { t } = useLanguage()

  const users = [
    { id: 1, name: "John Doe", email: "john@acme.com", role: "Admin", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@acme.com", role: "User", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@acme.com", role: "Viewer", status: "invited" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.title")}
        description={t("users.description")}
        action={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("users.invite")}
          </Button>
        }
      />

      <UsersTable
        users={users}
        translations={{
          user: t("users.table.user"),
          role: t("users.table.role"),
          status: t("users.table.status"),
          actions: t("users.table.actions"),
        }}
      />
    </div>
  )
}
