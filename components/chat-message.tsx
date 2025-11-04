import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import type { RagMessage, CitationLink } from "@/lib/mock-data"

interface ChatMessageProps {
  message: RagMessage
  onCitationClick?: (citation: CitationLink) => void
}

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const { t } = useLanguage()
  const { role, content, citations, timestamp, metadata, retrievedDocuments } = message
  const isUser = role === "user"
  const hasCitations = citations && citations.length > 0
  const hasRetrievedDocuments = retrievedDocuments && retrievedDocuments.length > 0

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      <Card
        className={cn("max-w-[80%] p-4", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
        role="group"
        aria-live="polite"
      >
        <div className="space-y-2">
          <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>

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
            <div className="space-y-3 pt-2 border-t border-border/50">
              {hasCitations && (
                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-70">{t("chat.citations")}</p>
                  <div className="flex flex-wrap gap-2">
                    {citations?.map((citation) => (
                      <Button
                        key={citation.id}
                        variant="outline"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs bg-transparent"
                        onClick={() => onCitationClick?.(citation)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {citation.document}
                        {citation.page && <span className="ml-1">p.{citation.page}</span>}
                        {typeof citation.score === "number" && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            {(citation.score * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {hasRetrievedDocuments && (
                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-70">{t("chat.retrievedDocuments.title")}</p>
                  <div className="space-y-2">
                    {retrievedDocuments?.map((doc) => {
                      const citation = citations?.find((item) => item.chunkId === doc.chunkId)
                      return (
                        <div
                          key={doc.id}
                          className="space-y-1 rounded-md border border-border/60 bg-background/40 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-medium">
                            <span className="truncate">{doc.documentName}</span>
                            {typeof doc.score === "number" && (
                              <Badge variant="outline" className="text-[10px]">
                                {(doc.score * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          {(doc.metadata?.page || doc.metadata?.section) && (
                            <p className="text-[11px] text-muted-foreground">
                              {doc.metadata?.page && `p.${doc.metadata.page}`}
                              {doc.metadata?.section && `${doc.metadata?.page ? " • " : ""}${doc.metadata.section}`}
                            </p>
                          )}
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">{doc.snippet}</p>
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

          {timestamp && <p className="text-xs opacity-50 pt-1">{timestamp}</p>}
        </div>
      </Card>
    </div>
  )
}
