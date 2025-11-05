"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { EmptyState } from "@/components/empty-state"
import { SearchResultCard } from "@/components/search-result-card"
import { ChunksDialog } from "@/components/documents/chunks-dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { ChunkRecord } from "@/lib/types"
import { searchVectorStore, getDocumentChunksByName } from "@/lib/dakkom-api"

export default function SearchPage() {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    id: string
    chunkId: string
    documentId: string
    document: string
    snippet: string
    similarity: number
    metadata?: { page?: number; section?: string }
  }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isChunksOpen, setIsChunksOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [extFilter, setExtFilter] = useState<string>("all")

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const res = await searchVectorStore(query, {})
      // Support both { results: [...] } and { retrieved_documents: [...] }
      const raw = (res as any).results ?? (res as any).retrieved_documents ?? []
      const mapped = raw.map((r: any, idx: number) => ({
        id: r.chunk_id ?? String(idx),
        chunkId: r.chunk_id ?? String(idx),
        documentId: r.document_id ?? r.source_file ?? "",
        document: r.source_file ?? r.document_id ?? "",
        snippet: r.snippet ?? r.document ?? "",
        similarity: Number(r.score ?? r.probability ?? 0),
        metadata: {},
      }))
      setResults(mapped)
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewSource = async (hit: { document: string; documentId: string; chunkId: string }) => {
    setChunkDialogDocument(hit.document)
    try {
      const res = await getDocumentChunksByName(hit.document)
      const chunks: ChunkRecord[] = res.chunks.map((c) => ({ id: c.id, content: c.value }))
      setChunkDialogContent(chunks)
    } catch {
      setChunkDialogContent([])
    }
    setIsChunksOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("search.title")} description={t("search.description")} />

        <Card className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  {t("search.searching")}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t("search.button")}
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 flex gap-3">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="INTERNAL">INTERNAL</SelectItem>
                <SelectItem value="WEB_PAGE">WEB_PAGE</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
            <Select value={extFilter} onValueChange={setExtFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="md">MD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {results.length === 0 ? (
          <EmptyState icon={Search} title={t("search.empty.title")} description={t("search.empty.description")} />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {
                results.filter((r) => {
                  const okSource = sourceFilter === "all" || (r as any).source === sourceFilter
                  const ext = r.document.split(".").pop()?.toLowerCase()
                  const okExt = extFilter === "all" || ext === extFilter
                  return okSource && okExt
                }).length
              } {t("search.results")}
            </p>
            {results
              .filter((r) => {
                const okSource = sourceFilter === "all" || (r as any).source === sourceFilter
                const ext = r.document.split(".").pop()?.toLowerCase()
                const okExt = extFilter === "all" || ext === extFilter
                return okSource && okExt
              })
              .map((result) => (
              <SearchResultCard
                key={result.id}
                document={result.document}
                content={result.snippet}
                score={result.similarity}
                metadata={{ page: result.metadata?.page, section: result.metadata?.section }}
                highlight={query}
                onView={() => handleViewSource(result)}
              />
            ))}
          </div>
        )}

        <ChunksDialog
          open={isChunksOpen}
          onOpenChange={setIsChunksOpen}
          documentName={chunkDialogDocument}
          chunks={chunkDialogContent}
        />
    </div>
  )
}
