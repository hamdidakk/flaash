"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"

interface SearchResultCardProps {
  document: string
  content: string
  score: number
  metadata?: {
    page?: number
    section?: string
    date?: string
  }
  onView?: () => void
}

export function SearchResultCard({ document, content, score, metadata, onView }: SearchResultCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate">{document}</span>
          </div>
          <Badge variant={score > 0.8 ? "default" : score > 0.6 ? "secondary" : "outline"} className="flex-shrink-0">
            {(score * 100).toFixed(0)}%
          </Badge>
        </div>

        {metadata && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            {metadata.page && <span>Page {metadata.page}</span>}
            {metadata.section && <span>• {metadata.section}</span>}
            {metadata.date && <span>• {metadata.date}</span>}
          </div>
        )}

        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">{content}</p>

        {onView && (
          <Button variant="ghost" size="sm" className="w-full justify-center" onClick={onView}>
            View Full Document
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  )
}
