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
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Shelf</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{shelfName}&rdquo;? Shelves
            with assigned books cannot be deleted.
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
