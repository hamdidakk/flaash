import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import type { RagMessage, CitationLink } from "@/lib/types"

interface ChatMessageProps {
  message: RagMessage
  onCitationClick?: (citation: CitationLink) => void
}

const META_LABELS = {
  fr: {
    source: "Source",
    source_type: "Type",
    author: "Auteur",
    theme: "Thématique",
    topic: "Sujet",
    category: "Catégorie",
    collection: "Collection",
    language: "Langue",
    url: "Source",
  },
  en: {
    source: "Source",
    source_type: "Type",
    author: "Author",
    theme: "Theme",
    topic: "Topic",
    category: "Category",
    collection: "Collection",
    language: "Language",
    url: "Source link",
  },
}

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const { t, language } = useLanguage()
  const { role, content, citations, timestamp, metadata, retrievedDocuments } = message
  const isUser = role === "user"
  const hasCitations = citations && citations.length > 0
  const hasRetrievedDocuments = retrievedDocuments && retrievedDocuments.length > 0

  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end flex-row-reverse" : "justify-start")}> 
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-full text-base",
          isUser ? "bg-blue-100" : "bg-gray-200",
        )}
        aria-hidden
      >
        {isUser ? "🧑" : "🤖"}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl border p-4 text-gray-800 fade-in-up",
          isUser ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100",
        )}
        role="group"
        aria-live="polite"
      >
        <div className="space-y-2">
          <p className="whitespace-pre-line text-sm leading-relaxed">{content}</p>

          {metadata && (metadata.collectionName || metadata.model || metadata.promptType) && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
              {metadata.collectionName && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {t("chat.metadata.collection")}: {metadata.collectionName}
                </Badge>
              )}
              {metadata.promptType && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {t("chat.metadata.promptType")}: {metadata.promptType}
                </Badge>
              )}
              {metadata.model && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {t("chat.metadata.model")}: {metadata.model}
                </Badge>
              )}
              {typeof metadata.temperature === "number" && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {t("chat.metadata.temperature")}: {metadata.temperature.toFixed(1)}
                </Badge>
              )}
            </div>
          )}

          {(hasCitations || hasRetrievedDocuments) && (
            <div className="space-y-3 border-t border-border/50 pt-2">
              {hasCitations && (
                <div className="space-y-2">
                  <div className="public-sources">
                    <div className="public-sources__header">
                      <p>{t("chat.citations")}</p>
                    </div>
                    <div className="public-sources__grid">
                      {citations?.map((citation) => (
                        <button
                          type="button"
                          key={citation.id}
                          className="public-sources__tile"
                          onClick={() => onCitationClick?.(citation)}
                        >
                          <div className="public-sources__tile-head">
                            <FileText className="size-4" />
                            <span className="public-sources__score">
                              {typeof citation.score === "number" ? `${Math.round(citation.score * 100)}%` : "—"}
                            </span>
                          </div>
                          <p className="public-sources__name">{citation.document}</p>
                          {citation.page && <span className="public-sources__meta">p.{citation.page}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasRetrievedDocuments && (
                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-70">{t("chat.retrievedDocuments.title")}</p>
                  <div className="space-y-2">
                    {retrievedDocuments?.map((doc) => {
                      const metadataEntries = Object.entries(doc.metadata ?? {}).filter(
                        ([, value]) => typeof value === "string" && value.trim().length > 0,
                      ) as Array<[string, string]>
                      const getMetadataLabel = (key: string) => {
                        const labels = META_LABELS[language as keyof typeof META_LABELS] ?? META_LABELS.en
                        return labels[key as keyof typeof labels] ?? key.replace(/_/g, " ")
                      }
                      const citation = citations?.find((item) => item.chunkId === doc.chunkId)
                      return (
                        <div
                          key={doc.id}
                          className="space-y-1 rounded-md border border-border/60 bg-background/40 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-900">
                            <span className="truncate text-[13px] font-semibold uppercase tracking-wide text-gray-900">
                              {doc.documentName}
                            </span>
                            {typeof doc.score === "number" && (
                              <Badge variant="outline" className="text-[10px]">
                                {(doc.score * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          {(Boolean((doc.metadata as any)?.page) || Boolean((doc.metadata as any)?.section)) && (
                            <p className="text-[11px] text-muted-foreground">
                              {!!(doc.metadata as any)?.page && `p.${String((doc.metadata as any)?.page)}`}
                              {!!(doc.metadata as any)?.section && `${(doc.metadata as any)?.page ? " • " : ""}${String((doc.metadata as any)?.section)}`}
                            </p>
                          )}
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">{doc.snippet}</p>
                          {metadataEntries.length > 0 && (
                            <div className="public-widget__doc-meta">
                              {metadataEntries.map(([key, value]) =>
                                key === "url" ? (
                                  <a
                                    key={`${doc.id}-${key}`}
                                    className="public-widget__doc-meta-link"
                                    href={value}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {getMetadataLabel(key)}
                                  </a>
                                ) : (
                                  <span key={`${doc.id}-${key}`} className="public-widget__doc-meta-pill">
                                    {getMetadataLabel(key)} · {value}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                          {citation && onCitationClick && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => onCitationClick(citation)}
                            >
                              {t("chat.retrievedDocuments.open")}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {timestamp && <p className="pt-1 text-xs opacity-50">{timestamp}</p>}
        </div>
      </div>
    </div>
  )
}
