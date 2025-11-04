"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChunkCard } from "@/components/chunk-card"

interface Chunk {
  id: number
  content: string
  page: number
  score: number
}

interface ChunksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName?: string
  chunks: Chunk[]
}

export function ChunksDialog({ open, onOpenChange, documentName, chunks }: ChunksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{documentName} - Chunks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {chunks.map((chunk) => (
            <ChunkCard key={chunk.id} chunk={chunk} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
