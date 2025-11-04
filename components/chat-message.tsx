import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Citation {
  id: string
  document: string
  chunk: string
  score: number
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
  timestamp?: string
}

export function ChatMessage({ role, content, citations, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3", role === "user" ? "justify-end" : "justify-start")}>
      <Card className={cn("max-w-[80%] p-4", role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{content}</p>

          {citations && citations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-xs font-medium opacity-70">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {citations.map((citation) => (
                  <Button
                    key={citation.id}
                    variant="outline"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs bg-transparent"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {citation.document}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {(citation.score * 100).toFixed(0)}%
                    </Badge>
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
