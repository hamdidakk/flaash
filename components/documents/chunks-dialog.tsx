"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ChunkCard } from "@/components/chunk-card"
import { useLanguage } from "@/lib/language-context"
import type { ChunkRecord } from "@/lib/types"

interface ChunksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName?: string
  chunks: ChunkRecord[]
  onInspectChunk?: (chunkId: string | number) => void
}

export function ChunksDialog({ open, onOpenChange, documentName, chunks, onInspectChunk }: ChunksDialogProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChunks = chunks.filter((chunk) => chunk.content.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {documentName} - {t("documents.chunks.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("documents.chunks.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {filteredChunks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? t("documents.chunks.noResults") : t("documents.empty.description")}
            </div>
          ) : (
              filteredChunks.map((chunk, index) => (
                <ChunkCard
                  key={chunk.id}
                  chunk={chunk}
                  index={index}
                  highlight={searchQuery}
                  onInspect={onInspectChunk}
                />
              ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
