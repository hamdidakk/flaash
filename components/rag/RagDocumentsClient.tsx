"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RefreshCw, Upload, Eye, Trash2, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentStatusBadge } from "@/components/document-status-badge"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog"
import { DeleteDocumentDialog } from "@/components/documents/delete-document-dialog"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { useToast } from "@/hooks/use-toast"
import type { KnowledgeDocument, ChunkRecord } from "@/lib/types"
import { getDocumentChunksByName, listDocumentNames } from "@/lib/dakkom-api"
import { useUploadHistory } from "@/hooks/use-upload-history"

const DEFAULT_SOURCE_LABEL = "Dakkom"

export function RagDocumentsClient() {
  const { handleError } = useErrorHandler()
  const { toast } = useToast()
  const { markConfirmed } = useUploadHistory()

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null)
  const [selectedChunks, setSelectedChunks] = useState<ChunkRecord[]>([])
  const [isChunksOpen, setIsChunksOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<KnowledgeDocument | null>(null)
  const [isChunksLoading, setIsChunksLoading] = useState(false)
  const [uploadNotice, setUploadNotice] = useState<number | null>(null)
  const loadRef = useRef(false)

  const filteredDocs = useMemo(() => {
    if (!search.trim()) {
      return documents
    }
    const query = search.toLowerCase()
    return documents.filter((doc) => doc.name.toLowerCase().includes(query))
  }, [documents, search])

  const loadDocuments = useCallback(async () => {
    if (loadRef.current) return
    loadRef.current = true
    setIsLoading(true)
    try {
      const res = await listDocumentNames()
      const nowIso = new Date().toISOString()
      const mapped: KnowledgeDocument[] = (res.documents ?? []).map((name, index) => ({
        id: `${name}-${index}`,
        name,
        status: "completed",
        size: "—",
        chunkCount: 0,
        ingestionProgress: 100,
        uploadedAtRaw: nowIso,
        source: DEFAULT_SOURCE_LABEL,
        owner: "Flaash",
      }))
      setDocuments(mapped)
    } catch (error) {
      handleError(error, { title: "Impossible de charger les documents" })
      setDocuments([])
    } finally {
      setIsLoading(false)
      loadRef.current = false
    }
  }, [handleError])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.sessionStorage.getItem("rag:last-upload")
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { count?: number }
      if (parsed?.count) {
        setUploadNotice(parsed.count)
        toast({
          title: "Nouveaux documents en cours d’indexation",
          description: `${parsed.count} fichier(s) viennent d’être ajoutés.`,
        })
      }
    } catch {
      // ignore parsing
    } finally {
      window.sessionStorage.removeItem("rag:last-upload")
    }
  }, [toast])

  const handleViewChunks = async (doc: KnowledgeDocument) => {
    setSelectedDoc(doc)
    setIsChunksLoading(true)
    try {
      const res = await getDocumentChunksByName(doc.name)
      const chunks: ChunkRecord[] = res.chunks.map((chunk) => ({
        id: chunk.id,
        content: chunk.value,
        metadata: {
          document: doc.name,
          source: chunk.source,
          url: chunk.url,
          isValidated: chunk.is_validated,
        },
      }))
      setSelectedChunks(chunks)
      setDocuments((prev) =>
        prev.map((item) => (item.id === doc.id ? { ...item, chunkCount: chunks.length } : item)),
      )
      if (chunks.length > 0) {
        markConfirmed(doc.name)
      }
      setIsChunksOpen(true)
    } catch (error) {
      handleError(error, { title: `Impossible d'ouvrir ${doc.name}` })
    } finally {
      setIsChunksLoading(false)
    }
  }

  const handleUploadComplete = () => {
    void loadDocuments()
  }

  const handleDeleteComplete = () => {
    setDocumentToDelete(null)
    void loadDocuments()
  }

  const formatDate = (value: string) => {
    try {
      return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  return (
    <div className="rag-documents rag-stack">
      {uploadNotice && (
        <Card className="rag-card rag-card--notice">
          <div className="rag-toolbar rag-toolbar--wrap">
            <Sparkles className="h-4 w-4 text-[var(--color-flaash-green)]" />
            <div>
              <p className="rag-meta-label">Mise à jour</p>
              <p className="text-base font-semibold">
                {uploadNotice} fichier{uploadNotice > 1 ? "s" : ""} en cours d’intégration dans la base.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto rag-button-ghost" onClick={() => setUploadNotice(null)}>
              OK
            </Button>
          </div>
        </Card>
      )}
      <Card className="rag-card">
        <div className="rag-card__header rag-card__header--start">
          <div>
            <p className="rag-meta-label">Base documentaire</p>
            <h2 className="rag-card__title">Documents indexés</h2>
            <p className="rag-card__subtitle">{documents.length} fichier(s) disponibles pour le RAG.</p>
          </div>
          <div className="rag-card__actions">
            <Button variant="ghost" className="rag-button-ghost" onClick={() => void loadDocuments()} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
            <Button className="dashboard-cta-accent" onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Ajouter un document
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rag-card overflow-hidden">
        <div className="rag-card__section rag-card__header">
          <div>
            <h3 className="rag-card__title text-xl">Fichiers indexés</h3>
            <p className="rag-card__subtitle">Prévisualisez les chunks ou supprimez un document de la base.</p>
          </div>
          <div className="rag-card__search">
            <Search className="rag-card__search-icon" />
            <Input
              placeholder="Rechercher un document…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rag-input pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="rag-empty-state">Chargement des documents…</div>
        ) : filteredDocs.length === 0 ? (
          <div className="rag-empty-state">Aucun document ne correspond à votre recherche.</div>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <table className="rag-table">
              <thead className="rag-table__head">
                <tr>
                  <th className="rag-table__cell">Document</th>
                  <th className="rag-table__cell">Source</th>
                  <th className="rag-table__cell">Ajouté</th>
                  <th className="rag-table__cell rag-table__cell--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="rag-table__row">
                    <td className="rag-table__cell">
                      <p className="rag-table__title">{doc.name}</p>
                      <div className="rag-table__subtitle">
                        <DocumentStatusBadge status={doc.status} />
                        {doc.chunkCount > 0 && <span>{doc.chunkCount} chunk(s)</span>}
                      </div>
                    </td>
                    <td className="rag-table__cell text-sm">
                      <Badge variant="outline" className="rag-table__badge">
                        {doc.source || DEFAULT_SOURCE_LABEL}
                      </Badge>
                    </td>
                    <td className="rag-table__cell text-sm text-white/70">{formatDate(doc.uploadedAtRaw)}</td>
                    <td className="rag-table__cell">
                      <div className="rag-table__actions">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rag-action-button"
                          onClick={() => void handleViewChunks(doc)}
                          disabled={isChunksLoading && selectedDoc?.id === doc.id}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir les extraits</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rag-action-button rag-action-button--danger"
                          onClick={() => setDocumentToDelete(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </Card>

      <ChunksDialog
        open={isChunksOpen}
        onOpenChange={setIsChunksOpen}
        documentName={selectedDoc?.name}
        chunks={selectedChunks}
      />

      <UploadDocumentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleUploadComplete}
        mode="single"
      />

      <DeleteDocumentDialog
        open={Boolean(documentToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setDocumentToDelete(null)
          }
        }}
        documentName={documentToDelete?.name || ""}
        onDeleteComplete={handleDeleteComplete}
      />
    </div>
  )
}

