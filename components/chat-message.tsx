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

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const { t } = useLanguage()
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
                          {(Boolean((doc.metadata as any)?.page) || Boolean((doc.metadata as any)?.section)) && (
                            <p className="text-[11px] text-muted-foreground">
                              {!!(doc.metadata as any)?.page && `p.${String((doc.metadata as any)?.page)}`}
                              {!!(doc.metadata as any)?.section && `${(doc.metadata as any)?.page ? " • " : ""}${String((doc.metadata as any)?.section)}`}
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

          {timestamp && <p className="pt-1 text-xs opacity-50">{timestamp}</p>}
        </div>
      </div>
    </div>
  )
}
