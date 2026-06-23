"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { PermissionRole } from "@/domain/entities/permission/Permission"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"

type DeleteRoleDialogState = {
  roleId: string
  roleName: string
  isSystem: boolean
}

type DeleteDialogOptions = {
  selectedRoleId: string | null
  selectedRole: PermissionRole | null
  roles: PermissionRole[]
  permissionManagementUseCase: PermissionManagementUseCase
  onRoleDeleted: (deletedRoleId: string, nextRoles: PermissionRole[]) => void
}

export type DeleteDialogResult = {
  deleteRoleDialog: DeleteRoleDialogState | null
  deleteRoleError: string | null
  isDeletingRole: boolean
  openDeleteRoleDialog: () => void
  closeDeleteRoleDialog: () => void
  confirmDeleteRole: () => Promise<void>
}

export function usePermissionsDeleteDialog(
  options: DeleteDialogOptions
): DeleteDialogResult {
  const queryClient = useQueryClient()

  const [deleteRoleDialog, setDeleteRoleDialog] =
    useState<DeleteRoleDialogState | null>(null)
  const [deleteRoleError, setDeleteRoleError] = useState<string | null>(null)

  const { mutateAsync: deleteRoleAsync, isPending: isDeletingRole } =
    useMutation({
      mutationFn: async (roleId: string) => {
        const result =
          await options.permissionManagementUseCase.deleteRole(roleId)
        if (!result.success) throw new Error(result.error)
        return roleId
      },
      onSuccess: (deletedRoleId) => {
        void queryClient.invalidateQueries({ queryKey: ["permissions"] })
        const nextRoles = options.roles.filter((r) => r.id !== deletedRoleId)
        options.onRoleDeleted(deletedRoleId, nextRoles)
        setDeleteRoleDialog(null)
        setDeleteRoleError(null)
      },
      onError: (err: Error) => setDeleteRoleError(err.message),
    })

  function openDeleteRoleDialog(): void {
    if (!options.selectedRole) return
    setDeleteRoleError(null)
    setDeleteRoleDialog({
      roleId: options.selectedRole.id,
      roleName: options.selectedRole.name,
      isSystem: options.selectedRole.isSystem,
    })
  }

  function closeDeleteRoleDialog(): void {
    if (isDeletingRole) return
    setDeleteRoleDialog(null)
    setDeleteRoleError(null)
  }

  async function confirmDeleteRole(): Promise<void> {
    if (!deleteRoleDialog || deleteRoleDialog.isSystem) return
    await deleteRoleAsync(deleteRoleDialog.roleId)
  }

  return {
    deleteRoleDialog,
    deleteRoleError,
    isDeletingRole,
    openDeleteRoleDialog,
    closeDeleteRoleDialog,
    confirmDeleteRole,
  }
}
