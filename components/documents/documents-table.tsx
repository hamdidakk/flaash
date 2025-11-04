"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Trash2, FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { DocumentStatusBadge } from "@/components/document-status-badge"

interface Document {
  id: number
  name: string
  status: string
  chunks: number
  size: string
  uploadedAt: string
}

interface DocumentsTableProps {
  documents: Document[]
  onViewChunks: (doc: Document) => void
  onDelete?: (doc: Document) => void
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
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <DocumentStatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{doc.chunks}</td>
                <td className="px-4 py-3 text-muted-foreground">{doc.size}</td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{doc.uploadedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewChunks(doc)}
                      disabled={doc.status !== "completed"}
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
