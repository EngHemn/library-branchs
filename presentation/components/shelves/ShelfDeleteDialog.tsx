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

type ShelfDeleteDialogProps = {
  open: boolean
  shelfName: string
  error: string | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ShelfDeleteDialog({
  open,
  shelfName,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: ShelfDeleteDialogProps) {
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
          <DialogTitle>{t("shelves.deleteDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("shelves.deleteDialog.description", { name: shelfName })}
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
              ? t("shelves.deleteDialog.deleting")
              : t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
