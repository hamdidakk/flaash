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

export default function SearchPage() {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          content:
            "The product specifications include advanced features such as real-time processing, scalable architecture, and comprehensive API documentation.",
          document: "Product Specifications.pdf",
          page: 5,
          score: 0.95,
          metadata: { section: "Features", chapter: 2 },
        },
        {
          id: 2,
          content:
            "Technical requirements specify minimum hardware specifications: 8GB RAM, 4-core processor, and 50GB storage space.",
          document: "Technical Documentation.pdf",
          page: 12,
          score: 0.89,
          metadata: { section: "Requirements", chapter: 3 },
        },
        {
          id: 3,
          content:
            "The API reference provides detailed endpoints for authentication, data retrieval, and real-time updates.",
          document: "API Reference.md",
          page: 1,
          score: 0.87,
          metadata: { section: "Endpoints", chapter: 1 },
        },
      ])
      setIsSearching(false)
    }, 1000)
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
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  )
}
