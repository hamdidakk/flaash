"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Trash2, FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { DocumentStatusBadge } from "@/components/document-status-badge"
import type { DocumentStatus } from "@/lib/mock-data"

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
}

export function DocumentsTable({ documents, onViewChunks, onDelete }: DocumentsTableProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">{t("documents.table.name")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{t("documents.table.status")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{t("documents.table.chunks")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{t("documents.table.size")}</th>
              <th className="px-4 py-3 text-left text-sm font-medium">{t("documents.table.uploaded")}</th>
              <th className="px-4 py-3 text-right text-sm font-medium">{t("documents.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium leading-tight">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.owner} • {doc.source}
                      </p>
                      {doc.batchId && (
                        <p className="text-[11px] text-muted-foreground/80">Batch {doc.batchId}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <DocumentStatusBadge status={doc.status} />
                    {doc.status === "processing" && (
                      <p className="text-xs text-muted-foreground">{doc.ingestionProgress}%</p>
                    )}
                    {doc.status === "failed" && doc.lastError && (
                      <p className="text-xs text-destructive/80 line-clamp-2">{doc.lastError}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{doc.chunkCount}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.size}</td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{doc.uploadedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewChunks(doc)}
                      disabled={doc.status !== "completed" || doc.chunkCount === 0}
                      aria-label={t("documents.chunks.title")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(doc)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
