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
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Book from Shelf</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove &ldquo;{bookTitle}&rdquo; from this
            shelf? The book itself will not be deleted from the library.
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? <Loader2Icon className="animate-spin" /> : null}
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
