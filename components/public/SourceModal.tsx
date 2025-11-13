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
      <DialogContent className="public-source-modal">
        <DialogHeader>
          <DialogTitle>Source</DialogTitle>
          <DialogDescription>{documentName}</DialogDescription>
        </DialogHeader>

        <div className="public-source-modal__body">
          {links.length === 0 ? (
            <p className="public-source-modal__empty">Aucun lien disponible pour cette source.</p>
          ) : (
            <ul className="public-source-modal__list">
              {links.map((l) => (
                <li key={l.href} className="public-source-modal__item">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="public-source-modal__link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onViewExcerpts && (
          <div className="public-source-modal__footer">
            <Button variant="outline" onClick={onViewExcerpts} className="public-source-modal__cta">
              Voir les extraits
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


