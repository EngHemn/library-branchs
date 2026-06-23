"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  PermissionCode,
  PermissionRole,
} from "@/domain/entities/permission/Permission"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type RoleDialogMode = "create" | "edit"

export type RoleFormState = {
  name: string
  description: string
}

const emptyRoleForm: RoleFormState = { name: "", description: "" }

type RoleDialogOptions = {
  selectedRoleId: string | null
  selectedRole: PermissionRole | null
  permissionManagementUseCase: PermissionManagementUseCase
  onRoleCreated: (newRole: PermissionRole) => void
}

export type RoleDialogResult = {
  roleDialogMode: RoleDialogMode | null
  roleForm: RoleFormState
  roleFormNameError: string | null
  roleFormError: string | null
  isSavingRole: boolean
  openCreateRoleDialog: () => void
  openEditRoleDialog: () => void
  closeRoleDialog: () => void
  setRoleFormName: (name: string) => void
  setRoleFormDescription: (description: string) => void
  submitRoleForm: () => Promise<void>
}

export function usePermissionsRoleDialog(
  options: RoleDialogOptions
): RoleDialogResult {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [roleDialogMode, setRoleDialogMode] = useState<RoleDialogMode | null>(
    null
  )
  const [roleForm, setRoleForm] = useState<RoleFormState>(emptyRoleForm)
  const [roleFormNameError, setRoleFormNameError] = useState<string | null>(
    null
  )
  const [roleFormError, setRoleFormError] = useState<string | null>(null)

  const { mutateAsync: createRoleAsync, isPending: isCreating } = useMutation({
    mutationFn: async (payload: { name: string; description: string }) => {
      const result =
        await options.permissionManagementUseCase.createRole(payload)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (newRole) => {
      void queryClient.invalidateQueries({ queryKey: ["permissions"] })
      options.onRoleCreated(newRole)
      setRoleDialogMode(null)
      setRoleForm(emptyRoleForm)
    },
    onError: (err: Error) => setRoleFormError(err.message),
  })

  const { mutateAsync: updateRoleAsync, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: { name: string; description: string }) => {
      if (!options.selectedRoleId) throw new Error("No role selected")
      const result = await options.permissionManagementUseCase.updateRole(
        options.selectedRoleId,
        payload
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["permissions"] })
      setRoleDialogMode(null)
      setRoleForm(emptyRoleForm)
    },
    onError: (err: Error) => setRoleFormError(err.message),
  })

  function openCreateRoleDialog(): void {
    setRoleDialogMode("create")
    setRoleForm(emptyRoleForm)
    setRoleFormNameError(null)
    setRoleFormError(null)
  }

  function openEditRoleDialog(): void {
    if (!options.selectedRole) return
    setRoleDialogMode("edit")
    setRoleForm({
      name: options.selectedRole.name,
      description: options.selectedRole.description,
    })
    setRoleFormNameError(null)
    setRoleFormError(null)
  }

  function closeRoleDialog(): void {
    if (isCreating || isUpdating) return
    setRoleDialogMode(null)
    setRoleForm(emptyRoleForm)
    setRoleFormNameError(null)
    setRoleFormError(null)
  }

  function setRoleFormName(name: string): void {
    setRoleForm((prev) => ({ ...prev, name }))
    setRoleFormNameError(null)
    setRoleFormError(null)
  }

  function setRoleFormDescription(description: string): void {
    setRoleForm((prev) => ({ ...prev, description }))
    setRoleFormError(null)
  }

  async function submitRoleForm(): Promise<void> {
    const trimmedName = roleForm.name.trim()
    if (!trimmedName) {
      setRoleFormNameError(t("permissions.errors.roleNameRequired"))
      return
    }
    setRoleFormError(null)

    const payload = { name: trimmedName, description: roleForm.description }

    if (roleDialogMode === "create") {
      await createRoleAsync(payload)
    } else if (roleDialogMode === "edit") {
      await updateRoleAsync(payload)
    }
  }

  return {
    roleDialogMode,
    roleForm,
    roleFormNameError,
    roleFormError,
    isSavingRole: isCreating || isUpdating,
    openCreateRoleDialog,
    openEditRoleDialog,
    closeRoleDialog,
    setRoleFormName,
    setRoleFormDescription,
    submitRoleForm,
  }
}
