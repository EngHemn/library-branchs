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
  const title = mode === "create" ? "Add Role" : "Edit Role"
  const descriptionText =
    mode === "create"
      ? "Create a new role, then configure its permissions."
      : "Update the role name and description."

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
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Enter role name"
              disabled={isSubmitting}
            />
            {nameError ? (
              <p className="text-sm text-destructive">{nameError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Describe what this role can do"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Add Role"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
