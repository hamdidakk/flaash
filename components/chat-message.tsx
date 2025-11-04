import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RagMessage, CitationLink } from "@/lib/mock-data"

interface ChatMessageProps {
  message: RagMessage
  onCitationClick?: (citation: CitationLink) => void
}

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const { role, content, citations, timestamp } = message
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn("max-w-[80%] p-4", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
        role="group"
        aria-live="polite"
      >
        <div className="space-y-2">
          <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>

          {citations && citations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-xs font-medium opacity-70">Sources :</p>
              <div className="flex flex-wrap gap-2">
                {citations.map((citation) => (
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

          {timestamp && <p className="text-xs opacity-50 pt-1">{timestamp}</p>}
        </div>
      </Card>
    </div>
  )
}
