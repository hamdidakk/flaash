"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Trash2, FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { DocumentStatusBadge } from "@/components/document-status-badge"
import type { DocumentStatus } from "@/lib/types"
import { DashboardTable, type DashboardTableColumn, type DashboardTableEmptyState } from "@/components/dashboard/DashboardTable"

interface DocumentRow {
  id: string
  name: string
  status: DocumentStatus
  chunkCount: number
  size: string
  uploadedAt: string
  owner: string
  source: string
  ingestionProgress: number
  lastError?: string
  batchId?: string
}

interface DocumentsTableProps {
  documents: DocumentRow[]
  onViewChunks: (doc: DocumentRow) => void
  onDelete?: (doc: DocumentRow) => void
  isLoading?: boolean
  emptyState?: DashboardTableEmptyState
}

export function DocumentsTable({ documents, onViewChunks, onDelete, isLoading = false, emptyState }: DocumentsTableProps) {
  const { t } = useLanguage()

  const columns: DashboardTableColumn<DocumentRow>[] = [
    {
      key: "name",
      header: t("documents.table.name"),
      render: (doc) => (
        <div className="dashboard-file-card__header">
          <div className="dashboard-file-card__meta">
            <FileText className="mt-1 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="dashboard-file-card__title leading-tight">{doc.name}</p>
              <p className="dashboard-file-card__size">
              {doc.owner} • {doc.source}
              </p>
              {doc.batchId ? <p className="text-[11px] text-muted-foreground/80">Batch {doc.batchId}</p> : null}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: t("documents.table.status"),
      render: (doc) => (
        <div className="space-y-1">
          <DocumentStatusBadge status={doc.status} />
          {doc.status === "processing" ? (
            <p className="text-xs text-muted-foreground">{doc.ingestionProgress}%</p>
          ) : null}
          {doc.status === "failed" && doc.lastError ? (
            <p className="text-xs text-destructive/80 line-clamp-2">{doc.lastError}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "chunkCount",
      header: t("documents.table.chunks"),
      className: "text-muted-foreground",
    },
    {
      key: "size",
      header: t("documents.table.size"),
      className: "text-muted-foreground",
    },
    {
      key: "uploadedAt",
      header: t("documents.table.uploaded"),
      className: "text-sm text-muted-foreground",
    },
    {
      key: "actions",
      header: t("documents.table.actions"),
      align: "right",
      render: (doc) => (
        <div className="rag-table__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChunks(doc)}
            disabled={doc.status !== "completed" || doc.chunkCount === 0}
            aria-label={t("documents.chunks.title")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onDelete ? (
            <Button variant="ghost" size="sm" onClick={() => onDelete(doc)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <Card>
      <DashboardTable
        columns={columns}
        rows={documents}
        isLoading={isLoading}
        getRowKey={(doc) => doc.id}
        emptyState={emptyState}
      />
    </Card>
  )
}
