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
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedRejectDialogProps = {
  open: boolean
  needName: string
  reason: string
  error: string | null
  isRejecting: boolean
  onReasonChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

export function NeedRejectDialog({
  open,
  needName,
  reason,
  error,
  isRejecting,
  onReasonChange,
  onClose,
  onConfirm,
}: NeedRejectDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("needs.rejectDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("needs.rejectDialog.description", { needName })}
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder={t("needs.rejectDialog.placeholder")}
          rows={3}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>
            {t("needs.rejectDialog.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isRejecting}
          >
            {isRejecting ? <Loader2Icon className="animate-spin" /> : null}
            {isRejecting
              ? t("needs.rejectDialog.rejecting")
              : t("needs.rejectDialog.reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
