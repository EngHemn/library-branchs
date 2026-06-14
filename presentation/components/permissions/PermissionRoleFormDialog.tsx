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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { translatePermissionError } from "@/presentation/components/permissions/permissionI18n"

type PermissionRoleFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  name: string
  description: string
  nameError: string | null
  formError: string | null
  isSubmitting: boolean
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function PermissionRoleFormDialog({
  open,
  mode,
  name,
  description,
  nameError,
  formError,
  isSubmitting,
  onNameChange,
  onDescriptionChange,
  onClose,
  onSubmit,
}: PermissionRoleFormDialogProps) {
  const { t } = useTranslation()
  const title =
    mode === "create"
      ? t("permissions.roleForm.createTitle")
      : t("permissions.roleForm.editTitle")
  const descriptionText =
    mode === "create"
      ? t("permissions.roleForm.createDescription")
      : t("permissions.roleForm.editDescription")

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="role-name">{t("permissions.roleForm.roleName")}</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t("permissions.roleForm.roleNamePlaceholder")}
              disabled={isSubmitting}
            />
            {nameError ? (
              <p className="text-sm text-destructive">
                {translatePermissionError(nameError, t)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">
              {t("permissions.roleForm.description")}
            </Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder={t("permissions.roleForm.descriptionPlaceholder")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {formError ? (
            <p className="text-sm text-destructive">
              {translatePermissionError(formError, t)}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              {isSubmitting
                ? mode === "create"
                  ? t("permissions.roleForm.creating")
                  : t("common.saving")
                : mode === "create"
                  ? t("permissions.roleForm.addRole")
                  : t("common.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
