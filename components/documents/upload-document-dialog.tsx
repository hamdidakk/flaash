"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import { Upload, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: () => void
}

export function UploadDocumentDialog({ open, onOpenChange, onUploadComplete }: UploadDocumentDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      toast({
        title: t("documents.uploadSuccess"),
        description: t("documents.uploadSuccessDescription"),
      })
      setIsUploading(false)
      setFiles([])
      onOpenChange(false)
      onUploadComplete?.()
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("documents.uploadDialog.title")}</DialogTitle>
          <DialogDescription>{t("documents.uploadDialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>{t("documents.uploadDialog.selectedFiles")}</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? t("documents.uploading") : t("documents.upload")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
