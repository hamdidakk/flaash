"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { EmptyState } from "@/components/empty-state"
import { DocumentsSearch } from "@/components/documents/documents-search"
import { DocumentsFilters } from "@/components/documents/documents-filters"
import { DocumentsTable } from "@/components/documents/documents-table"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog"
import { DeleteDocumentDialog } from "@/components/documents/delete-document-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { KnowledgeDocument, ChunkRecord } from "@/lib/types"
import { listDocumentNames, getDocumentChunksByName, removeDocumentByName } from "@/lib/dakkom-api"

export default function DocumentsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null)
  const [selectedChunks, setSelectedChunks] = useState<ChunkRecord[]>([])
  const [showChunks, setShowChunks] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("single")
  const [showDelete, setShowDelete] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<KnowledgeDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formatDisplayDate = (value: string) => new Date(value).toLocaleString()

  const reloadDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await listDocumentNames()
      const nowIso = new Date().toISOString()
      const mapped: KnowledgeDocument[] = res.documents.map((name, idx) => ({
        id: `${name}-${idx}`,
        name,
        status: "completed",
        size: "",
        chunkCount: 0,
        ingestionProgress: 100,
        uploadedAtRaw: nowIso,
        source: "API",
        owner: "",
      }))
      setDocuments(mapped)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void reloadDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.owner.toLowerCase().includes(query) ||
      doc.source.toLowerCase().includes(query)
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter

    let matchesDateRange = true
    if (dateFrom || dateTo) {
      const docDate = new Date(doc.uploadedAtRaw)
      if (dateFrom) {
        matchesDateRange = matchesDateRange && docDate >= new Date(dateFrom)
      }
      if (dateTo) {
        matchesDateRange = matchesDateRange && docDate <= new Date(`${dateTo}T23:59:59`)
      }
    }

    return matchesSearch && matchesStatus && matchesDateRange
  })

  const handleClearFilters = () => {
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  const handleViewChunks = async (doc: KnowledgeDocument) => {
    setSelectedDoc(doc)
    try {
      const res = await getDocumentChunksByName(doc.name)
      const chunks: ChunkRecord[] = res.chunks.map((c) => ({
        id: c.id,
        content: c.value,
        metadata: { document: doc.name, documentId: doc.id, source: c.source, isValidated: c.is_validated },
      }))
      setSelectedChunks(chunks)
    } catch {
      setSelectedChunks([])
    }
    setShowChunks(true)
  }

  const handleDelete = (doc: KnowledgeDocument) => {
    setDocumentToDelete(doc)
    setShowDelete(true)
  }

  const handleUploadComplete = () => {
    void reloadDocuments()
  }

  const handleOpenUpload = (mode: "single" | "batch") => {
    setUploadMode(mode)
    setShowUpload(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!documentToDelete) return
    try {
      await removeDocumentByName(documentToDelete.name)
      await reloadDocuments()
    } finally {
      setShowDelete(false)
      setDocumentToDelete(null)
    }
  }

  const tableRows = filteredDocs.map((doc) => ({
    ...doc,
    uploadedAt: formatDisplayDate(doc.uploadedAtRaw),
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("documents.title")}
        description={t("documents.description")}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                {t("documents.upload")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => handleOpenUpload("single")}>{t("documents.upload")}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleOpenUpload("batch")}>
                {t("documents.uploadDialog.batchMode")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <DocumentsSearch value={searchQuery} onChange={setSearchQuery} />

      <DocumentsFilters
        statusFilter={statusFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusChange={setStatusFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : tableRows.length === 0 ? (
        <EmptyState icon={FileText} title={t("documents.empty.title")} description={t("documents.empty.description")} />
      ) : (
        <DocumentsTable
          documents={tableRows}
          onViewChunks={(row) => {
            const original = documents.find((doc) => doc.id === row.id)
            if (original) {
              void handleViewChunks(original)
            }
          }}
          onDelete={(row) => {
            const original = documents.find((doc) => doc.id === row.id)
            if (original) {
              handleDelete(original)
            }
          }}
        />
      )}

        <ChunksDialog
          open={showChunks}
          onOpenChange={setShowChunks}
          documentName={selectedDoc?.name}
          chunks={selectedChunks}
        />

        <UploadDocumentDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          onUploadComplete={handleUploadComplete}
          mode={uploadMode}
        />

        <DeleteDocumentDialog
          open={showDelete}
          onOpenChange={setShowDelete}
          documentName={documentToDelete?.name || ""}
          onDeleteComplete={handleDeleteConfirmed}
        />
    </div>
  )
}
