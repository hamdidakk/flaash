"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { removeDocumentByName } from "@/lib/dakkom-api"

interface DeleteDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName: string
  onDeleteComplete?: () => void
}

export function DeleteDocumentDialog({
  open,
  onOpenChange,
  documentName,
  onDeleteComplete,
}: DeleteDocumentDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await removeDocumentByName(documentName)
      toast({
        title: t("documents.deleteSuccess"),
        description: t("documents.deleteSuccessDescription"),
      })
      onDeleteComplete?.()
    } catch (e) {
      // If the backend reports the file has no nodes, consider the delete idempotent/successful
      try {
        const msg = e instanceof Error ? e.message : String(e)
        const parsed = msg && msg.trim().startsWith("{") ? JSON.parse(msg) : undefined
        const err = (parsed?.error as string) || msg
        if (err && err.toLowerCase().includes("no nodes found for file")) {
          toast({ title: t("documents.deleteSuccess"), description: t("documents.deleteSuccessDescription") })
          onDeleteComplete?.()
          return
        }
        toast({ title: t("errors.generic.title"), description: err || t("errors.generic.description"), variant: "destructive" })
      } catch {
        toast({ title: t("errors.generic.title"), description: t("errors.generic.description"), variant: "destructive" })
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("documents.deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("documents.deleteDialog.description")} <strong>{documentName}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="dashboard-dialog__footer">
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>{t("common.delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
