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

type StaffDeleteDialogProps = {
  open: boolean
  staffName: string
  error: string | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function StaffDeleteDialog({
  open,
  staffName,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: StaffDeleteDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("staff.deleteDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("staff.deleteDialog.description", { name: staffName })}
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2Icon className="animate-spin" /> : null}
            {isDeleting
              ? t("staff.deleteDialog.deleting")
              : t("staff.deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
