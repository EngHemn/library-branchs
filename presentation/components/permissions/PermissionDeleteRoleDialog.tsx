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
import { translatePermissionError } from "@/presentation/components/permissions/permissionI18n"

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
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSystem
              ? t("permissions.deleteDialog.cannotDeleteTitle")
              : t("permissions.deleteDialog.deleteTitle")}
          </DialogTitle>
          <DialogDescription>
            {isSystem
              ? t("permissions.deleteDialog.systemDescription", { name: roleName })
              : t("permissions.deleteDialog.confirmDescription", { name: roleName })}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">
            {translatePermissionError(error, t)}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {isSystem ? t("common.close") : t("common.cancel")}
          </Button>
          {!isSystem ? (
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2Icon className="animate-spin" /> : null}
              {isDeleting
                ? t("permissions.deleteDialog.deleting")
                : t("permissions.deleteDialog.confirm")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
