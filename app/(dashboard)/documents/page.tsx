"use client"

import { useState } from "react"
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

export default function DocumentsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [showChunks, setShowChunks] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<any>(null)

  // Mock data
  const documents = [
    {
      id: 1,
      name: "Product Specifications.pdf",
      status: "completed",
      chunks: 45,
      size: "2.3 MB",
      uploadedAt: "2025-01-15 10:30",
    },
    {
      id: 2,
      name: "User Manual v2.docx",
      status: "processing",
      chunks: 0,
      size: "1.8 MB",
      uploadedAt: "2025-01-15 11:45",
    },
    {
      id: 3,
      name: "Technical Documentation.pdf",
      status: "completed",
      chunks: 128,
      size: "5.7 MB",
      uploadedAt: "2025-01-14 09:15",
    },
    { id: 4, name: "API Reference.md", status: "failed", chunks: 0, size: "450 KB", uploadedAt: "2025-01-14 14:20" },
  ]

  const mockChunks = [
    {
      id: 1,
      content:
        "This is the first chunk of the document containing important information about the product specifications...",
      page: 1,
      score: 0.95,
    },
    {
      id: 2,
      content: "The second chunk discusses technical requirements and implementation details for the system...",
      page: 2,
      score: 0.89,
    },
    {
      id: 3,
      content: "Additional context about performance metrics and benchmarking results...",
      page: 3,
      score: 0.87,
    },
  ]

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter

    let matchesDateRange = true
    if (dateFrom || dateTo) {
      const docDate = new Date(doc.uploadedAt)
      if (dateFrom) {
        matchesDateRange = matchesDateRange && docDate >= new Date(dateFrom)
      }
      if (dateTo) {
        matchesDateRange = matchesDateRange && docDate <= new Date(dateTo + " 23:59:59")
      }
    }

    return matchesSearch && matchesStatus && matchesDateRange
  })

  const handleClearFilters = () => {
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  const handleViewChunks = (doc: any) => {
    setSelectedDoc(doc)
    setShowChunks(true)
  }

  const handleDelete = (doc: any) => {
    setDocumentToDelete(doc)
    setShowDelete(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("documents.title")}
        description={t("documents.description")}
        action={
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {t("documents.upload")}
          </Button>
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

      {filteredDocs.length === 0 ? (
        <EmptyState icon={FileText} title={t("documents.empty.title")} description={t("documents.empty.description")} />
      ) : (
        <DocumentsTable documents={filteredDocs} onViewChunks={handleViewChunks} onDelete={handleDelete} />
      )}

      <ChunksDialog
        open={showChunks}
        onOpenChange={setShowChunks}
        documentName={selectedDoc?.name}
        chunks={mockChunks}
      />

      <UploadDocumentDialog open={showUpload} onOpenChange={setShowUpload} />

      <DeleteDocumentDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        documentName={documentToDelete?.name || ""}
      />
    </div>
  )
}
