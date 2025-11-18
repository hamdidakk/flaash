"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { Upload, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { KnowledgeDocument } from "@/lib/types"
import { uploadDocument, uploadBatch } from "@/lib/dakkom-api"
import { AppError } from "@/lib/error-handler"
import { ThrottlingAlert } from "@/components/error/throttling-alert"

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (documents: KnowledgeDocument[]) => void
  mode?: "single" | "batch"
}

interface UploadEntry {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "completed"
}

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} B`
}

export function UploadDocumentDialog({ open, onOpenChange, onUploadComplete, mode = "single" }: UploadDocumentDialogProps) {
  const { t } = useLanguage()
  const { handleError } = useErrorHandler()
  const { toast } = useToast()
  const [entries, setEntries] = useState<UploadEntry[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [throttledReason, setThrottledReason] = useState<string | null>(null)
  const isBatch = mode === "batch"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const newEntries: UploadEntry[] = Array.from(e.target.files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      progress: 0,
      status: "pending",
    }))

    setEntries((prev) => {
      const existingIds = new Set(prev.map((entry) => entry.id))
      const deduped = newEntries.filter((entry) => !existingIds.has(entry.id))
      return [...prev, ...deduped]
    })

    // Reset input so the same file can be selected again if needed
    e.target.value = ""
  }

  const handleRemoveFile = (id: string) => {
    if (isUploading) return
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const averageProgress = useMemo(() => {
    if (entries.length === 0) return 0
    const total = entries.reduce((sum, entry) => sum + entry.progress, 0)
    return Math.round(total / entries.length)
  }, [entries])

  const statusLabels: Record<UploadEntry["status"], string> = {
    pending: t("documents.uploadDialog.statusPending"),
    uploading: t("documents.uploadDialog.statusUploading"),
    completed: t("documents.uploadDialog.statusCompleted"),
  }

  const handleUpload = async () => {
    if (entries.length === 0) return
    setThrottledReason(null)

    setIsUploading(true)
    const snapshot = entries.map((entry) => entry)

    setEntries((prev) => prev.map((entry) => ({ ...entry, status: "uploading", progress: Math.max(entry.progress, 12) })))

    const progressInterval = setInterval(() => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.status === "uploading"
            ? { ...entry, progress: Math.min(entry.progress + Math.random() * 25, 95) }
            : entry,
        ),
      )
    }, 320)

    try {
      if (isBatch) {
        const form = new FormData()
        snapshot.forEach((entry) => form.append("files", entry.file))
        // Le backend attend le paramètre source (INTERNAL, WEB_PAGE, OTHER)
        form.append("source", "INTERNAL")
        await uploadBatch(form)
      } else {
        for (const entry of snapshot) {
          const form = new FormData()
          form.append("file", entry.file)
          // Le backend attend le paramètre source (INTERNAL, WEB_PAGE, OTHER)
          form.append("source", "INTERNAL")
          await uploadDocument(form)
        }
      }

      clearInterval(progressInterval)
      setEntries((prev) => prev.map((entry) => ({ ...entry, status: "completed", progress: 100 })))
      toast({
        title: t("documents.uploadSuccess"),
        description: t("documents.uploadSuccessDescription"),
      })
      onUploadComplete?.([] as unknown as KnowledgeDocument[])
      setEntries([])
      onOpenChange(false)
    } catch (e) {
      clearInterval(progressInterval)
      setIsUploading(false)
      
      // Gérer les erreurs de throttling
      if (e instanceof AppError && e.throttled) {
        setThrottledReason(e.message || t("throttling.description"))
        return
      }
      
      // Utiliser useErrorHandler pour afficher l'erreur via toast
      // showToast=false car on veut afficher un message personnalisé dans le dialog
      handleError(e, { 
        title: t("documents.uploadFailed") || t("documents.upload"), 
        showToast: false 
      })
      
      // Afficher un toast personnalisé avec plus de détails
      let description = t("documents.errors.uploadFailed")
      if (e instanceof AppError) {
        description = e.message || description
      } else if (e instanceof Error) {
        description = e.message || description
      }
      
      toast({ 
        title: t("documents.uploadFailed") || t("documents.upload"), 
        description, 
        variant: "destructive" 
      })
    }
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isUploading) {
      return
    }

    if (!nextOpen) {
      setEntries([])
      setIsUploading(false)
      setThrottledReason(null)
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle>{t("documents.uploadDialog.title")}</DialogTitle>
            {isBatch && <Badge variant="secondary">{t("documents.uploadDialog.batchMode")}</Badge>}
          </div>
          <DialogDescription>{t("documents.uploadDialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {throttledReason && <ThrottlingAlert reason={throttledReason} onRetry={() => setThrottledReason(null)} />}
          <div className="space-y-2">
            <Label htmlFor="file-upload">{t("documents.uploadDialog.selectFiles")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("documents.uploadDialog.supportedFormats")}</p>
            {isBatch && <p className="text-xs text-muted-foreground">{t("documents.uploadDialog.batchHelper")}</p>}
          </div>

          {entries.length > 0 && (
            <div className="space-y-2">
              <Label>{t("documents.uploadDialog.selectedFiles")}</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {entries.map((entry) => (
                  <div key={entry.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <File className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{entry.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(entry.file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(entry.id)}
                        disabled={isUploading}
                        className="h-7 w-7 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Progress value={entry.progress} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{statusLabels[entry.status]}</span>
                        <span>{Math.round(entry.progress)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpload} disabled={entries.length === 0 || isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? `${t("documents.uploading")} (${averageProgress}%)` : t("documents.upload")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
