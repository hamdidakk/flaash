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

  const handleDelete = () => {
    // Simulate delete
    setTimeout(() => {
      toast({
        title: t("documents.deleteSuccess"),
        description: t("documents.deleteSuccessDescription"),
      })
      onDeleteComplete?.()
    }, 500)
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
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
