"use client"

import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfBookDeleteDialogProps = {
  open: boolean
  bookTitle: string
  error: string | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ShelfBookDeleteDialog({
  open,
  bookTitle,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: ShelfBookDeleteDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("shelves.bookDeleteDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("shelves.bookDeleteDialog.description", { title: bookTitle })}
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? <Loader2Icon className="animate-spin" /> : null}
            {isDeleting
              ? t("shelves.bookDeleteDialog.removing")
              : t("shelves.bookDeleteDialog.remove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
