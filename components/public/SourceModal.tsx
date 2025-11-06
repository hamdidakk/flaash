"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SourceLink {
  label: string
  href: string
}

interface SourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName?: string
  links: SourceLink[]
  onViewExcerpts?: () => void
}

export function SourceModal({ open, onOpenChange, documentName, links, onViewExcerpts }: SourceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Source</DialogTitle>
          <DialogDescription>{documentName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun lien disponible pour cette source.</p>
          ) : (
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onViewExcerpts && (
          <div className="pt-2">
            <Button variant="outline" onClick={onViewExcerpts} className="w-full">
              Voir les extraits
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


