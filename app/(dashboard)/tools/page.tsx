import { DashboardGuard } from "@/components/dashboard/dashboard-guard"
import { PageHeader } from "@/components/page-header"
import { ToolsWorkspace } from "@/components/dashboard/ToolsWorkspace"

export default function AdminToolsPage() {
  return (
    <DashboardGuard>
      <PageHeader
        title="Outils RAG & Vector Store"
        description="Accédez aux outils internes pour gérer les documents, interroger le vector store, lancer des générations RAG ou déclencher des évaluations."
      />

      <ToolsWorkspace />
    </DashboardGuard>
  )
}

