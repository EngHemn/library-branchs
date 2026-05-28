"use client"

import { AlertTriangleIcon, ShoppingCartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type BranchChangeDialogProps = {
  isOpen: boolean
  currentBranchName: string
  pendingBranchName: string
  cartItemCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function BranchChangeDialog({
  isOpen,
  currentBranchName,
  pendingBranchName,
  cartItemCount,
  onConfirm,
  onCancel,
}: BranchChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel() }}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <AlertTriangleIcon className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle>Change shopping branch?</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 text-left">
            <span className="block">
              You have{" "}
              <strong>
                {cartItemCount} item{cartItemCount !== 1 ? "s" : ""}
              </strong>{" "}
              in your cart from{" "}
              <strong>{currentBranchName}</strong>.
            </span>
            <span className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              <ShoppingCartIcon className="mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-300" />
              <span className="leading-relaxed">
                Switching to <strong>{pendingBranchName}</strong> will clear
                your current cart. This cannot be undone.
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Keep current branch
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Clear cart & switch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
