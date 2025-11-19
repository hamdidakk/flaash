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
    <div className="rag-documents space-y-6">
      {uploadNotice && (
        <Card className="border border-[var(--color-flaash-green)]/40 bg-[var(--color-flaash-green)]/10 px-6 py-4 text-white shadow-[0_0_25px_rgba(0,172,142,0.2)]">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[var(--color-flaash-green)]" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Mise à jour</p>
              <p className="text-base font-semibold">
                {uploadNotice} fichier{uploadNotice > 1 ? "s" : ""} en cours d’intégration dans la base.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto text-white hover:bg-white/10" onClick={() => setUploadNotice(null)}>
              OK
            </Button>
          </div>
        </Card>
      )}
      <Card className="flex flex-wrap items-center justify-between gap-4 border-white/10 bg-white/5 p-6 text-white shadow-lg shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Base documentaire</p>
          <h2 className="mt-2 text-2xl font-semibold">Documents indexés</h2>
          <p className="text-sm text-white/70">{documents.length} fichier(s) disponibles pour le RAG.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={() => void loadDocuments()}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
          <Button
            className="bg-[var(--color-flaash-green)] text-white hover:bg-[var(--color-flaash-green-hover)]"
            onClick={() => setIsUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Ajouter un document
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden border border-white/10 bg-white/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Fichiers indexés</h3>
            <p className="text-sm text-white/70">Prévisualisez les chunks ou supprimez un document de la base.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Rechercher un document…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-white/70">Chargement des documents…</div>
        ) : filteredDocs.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-white/70">
            Aucun document ne correspond à votre recherche.
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/[0.02] text-left text-sm uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-6 py-3">Document</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Ajouté</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-b border-white/[0.04] text-white/80 hover:bg-white/[0.03]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{doc.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                        <DocumentStatusBadge status={doc.status} />
                        {doc.chunkCount > 0 && <span>{doc.chunkCount} chunk(s)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="outline" className="border-white/30 text-white">
                        {doc.source || DEFAULT_SOURCE_LABEL}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{formatDate(doc.uploadedAtRaw)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/10"
                          onClick={() => void handleViewChunks(doc)}
                          disabled={isChunksLoading && selectedDoc?.id === doc.id}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir les extraits</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/20"
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

