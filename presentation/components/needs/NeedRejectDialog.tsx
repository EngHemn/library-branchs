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
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject need request?</DialogTitle>
          <DialogDescription>
            Reject{" "}
            <span className="font-medium text-foreground">{needName}</span> and
            optionally provide a reason for the requester.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          placeholder="Rejection reason (optional)"
          rows={3}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isRejecting}>
            {isRejecting ? <Loader2Icon className="animate-spin" /> : null}
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
