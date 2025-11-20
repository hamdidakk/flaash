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
    <Card className="dashboard-chunk-card">
      <div className="space-y-3">
        <div className="dashboard-chunk-card__header">
          <div className="dashboard-chunk-card__meta">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="dashboard-chunk-card__title">Chunk {index + 1}</span>
              {metadata?.document && <p className="dashboard-chunk-card__subtitle">{metadata.document}</p>}
            </div>
          </div>
          <div className="dashboard-chunk-card__badges">
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

        {metadata?.section ? <p className="dashboard-chunk-card__section">{metadata.section}</p> : null}

        <p className="dashboard-chunk-card__content">{getHighlightedContent(content, highlight)}</p>

        {onInspect && (
          <button type="button" onClick={() => onInspect(chunk.id)} className="dashboard-chunk-card__action">
            Inspect chunk context
          </button>
        )}
      </div>
    </Card>
  )
}
