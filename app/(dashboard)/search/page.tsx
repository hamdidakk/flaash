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
import {
  semanticSearchResults,
  findChunkById,
  getChunksForDocument,
  type SemanticSearchHit,
  type ChunkRecord,
} from "@/lib/mock-data"

export default function SearchPage() {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SemanticSearchHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isChunksOpen, setIsChunksOpen] = useState(false)
  const [chunkDialogDocument, setChunkDialogDocument] = useState<string | undefined>()
  const [chunkDialogContent, setChunkDialogContent] = useState<ChunkRecord[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    const normalizedQuery = query.trim().toLowerCase()

    setTimeout(() => {
      const filtered = semanticSearchResults.filter((hit) => {
        if (!normalizedQuery) return true

        const haystacks = [
          hit.snippet,
          hit.document,
          hit.metadata?.section,
          hit.metadata?.chapter?.toString(),
        ]
          .filter(Boolean)
          .map((value) => value!.toString().toLowerCase())

        return haystacks.some((value) => value.includes(normalizedQuery))
      })

      setResults(filtered.length > 0 ? filtered : semanticSearchResults.slice(0, 3))
      setIsSearching(false)
    }, 800)
  }

  const handleViewSource = (hit: SemanticSearchHit) => {
    const chunk = findChunkById(hit.chunkId)
    const documentChunks = chunk ? [chunk] : getChunksForDocument(hit.documentId)

    setChunkDialogDocument(hit.document)
    setChunkDialogContent(documentChunks)
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
        </Card>

        {results.length === 0 ? (
          <EmptyState icon={Search} title={t("search.empty.title")} description={t("search.empty.description")} />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {results.length} {t("search.results")}
            </p>
            {results.map((result) => (
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
