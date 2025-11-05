import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Sparkles } from "lucide-react"

type ChunkMetadata = {
  page?: number
  tokens?: number
  section?: string
  score?: number
  document?: string
  source?: string
  isValidated?: boolean
}

interface ChunkCardProps {
  chunk: {
    id: number | string
    content: string
    metadata?: ChunkMetadata
  }
  index: number
  highlight?: string
  onInspect?: (chunkId: number | string) => void
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getHighlightedContent(text: string, highlight?: string) {
  if (!highlight) return text

  const escaped = escapeRegExp(highlight.trim())
  if (!escaped) return text

  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  const highlightLower = highlight.trim().toLowerCase()

  return parts.map((part, index) => {
    const key = `${part}-${index}`
    if (part.toLowerCase() === highlightLower) {
      return (
        <mark key={key} className="rounded bg-primary/20 px-1 py-0.5">
          {part}
        </mark>
      )
    }

    return <span key={key}>{part}</span>
  })
}

export function ChunkCard({ chunk, index, highlight, onInspect }: ChunkCardProps) {
  const { content, metadata } = chunk

  return (
    <Card className="p-4 hover:bg-muted/60 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-semibold text-foreground/90">Chunk {index + 1}</span>
              {metadata?.document && (
                <p className="text-xs text-muted-foreground">{metadata.document}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {metadata?.score !== undefined && (
              <Badge variant={metadata.score > 0.85 ? "default" : "secondary"} className="text-xs gap-1">
                <Sparkles className="h-3 w-3" />
                {(metadata.score * 100).toFixed(0)}%
              </Badge>
            )}
            {metadata?.page && (
              <Badge variant="outline" className="text-xs">
                Page {metadata.page}
              </Badge>
            )}
            {metadata?.tokens && (
              <Badge variant="secondary" className="text-xs">
                {metadata.tokens} tokens
              </Badge>
            )}
          {metadata?.source && (
            <Badge variant="outline" className="text-xs">
              {metadata.source}
            </Badge>
          )}
          {metadata?.isValidated !== undefined && (
            <Badge variant={metadata.isValidated ? "default" : "secondary"} className="text-xs">
              {metadata.isValidated ? "validated" : "unvalidated"}
            </Badge>
          )}
          </div>
        </div>

        {metadata?.section && <p className="text-xs uppercase tracking-wide text-muted-foreground">{metadata.section}</p>}

        <p className="text-sm leading-relaxed text-foreground/90 space-y-1">
          {getHighlightedContent(content, highlight)}
        </p>

        {onInspect && (
          <button
            type="button"
            onClick={() => onInspect(chunk.id)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Inspect chunk context
          </button>
        )}
      </div>
    </Card>
  )
}
