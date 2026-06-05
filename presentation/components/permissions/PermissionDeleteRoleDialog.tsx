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

type PermissionDeleteRoleDialogProps = {
  open: boolean
  roleName: string
  isSystem: boolean
  error: string | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PermissionDeleteRoleDialog({
  open,
  roleName,
  isSystem,
  error,
  isDeleting,
  onClose,
  onConfirm,
}: PermissionDeleteRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSystem ? "Cannot Delete Role" : "Delete Role"}
          </DialogTitle>
          <DialogDescription>
            {isSystem ? (
              <>
                <span className="font-medium text-foreground">{roleName}</span> is a
                system role and cannot be deleted.
              </>
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">{roleName}</span>? Staff
                members assigned to this role must be reassigned first. This action
                cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {isSystem ? "Close" : "Cancel"}
          </Button>
          {!isSystem ? (
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2Icon className="animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete Role"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
