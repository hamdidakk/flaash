import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

interface ChunkCardProps {
  content: string
  metadata?: {
    page?: number
    section?: string
    tokens?: number
  }
  index: number
}

export function ChunkCard({ content, metadata, index }: ChunkCardProps) {
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Chunk {index + 1}</span>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>

        {metadata?.section && <p className="text-xs text-muted-foreground">{metadata.section}</p>}

        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-4">{content}</p>
      </div>
    </Card>
  )
}
