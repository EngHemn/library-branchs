"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { PermissionCode, PermissionConfig, PermissionRole } from "@/domain/entities/permission/Permission"
import type { User } from "@/domain/entities/User"
import { filterPermissionRolesForUser } from "@/domain/services/staffPermissionsScope"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"
import { usePermissionsData } from "./usePermissionsData"
import { usePermissionsRoleDialog, type RoleDialogMode, type RoleFormState } from "./usePermissionsRoleDialog"
import { usePermissionsDeleteDialog } from "./usePermissionsDeleteDialog"
import type { PermissionsPageStatus, PermissionsViewModelState } from "./PermissionsViewModelState"

type PermissionsViewModel = {
  state: PermissionsViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  selectRole: (roleId: string) => void
  setSearchQuery: (query: string) => void
  togglePermission: (permission: PermissionCode) => void
  selectAllInCategory: (categoryName: string) => void
  deselectAllInCategory: (categoryName: string) => void
  resetPermissions: () => void
  savePermissions: () => Promise<void>
  openCreateRoleDialog: () => void
  openEditRoleDialog: () => void
  closeRoleDialog: () => void
  setRoleFormName: (name: string) => void
  setRoleFormDescription: (description: string) => void
  submitRoleForm: () => Promise<void>
  openDeleteRoleDialog: () => void
  closeDeleteRoleDialog: () => void
  confirmDeleteRole: () => Promise<void>
}

export function usePermissionsViewModel(
  authUseCase: AuthUseCase,
  permissionManagementUseCase: PermissionManagementUseCase
): PermissionsViewModel {
  const queryClient = useQueryClient()
  const { data, isPending, isFetching, isError, error, refetch } = usePermissionsData(
    authUseCase,
    permissionManagementUseCase
  )

  const roles = data?.roles ?? []
  const config = data?.config ?? null
  const user = data?.user ?? null
  const visibleRoles = user ? filterPermissionRolesForUser(roles, user) : roles

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [draftPermissions, setDraftPermissions] = useState<PermissionCode[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (visibleRoles.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true
      setSelectedRoleId(visibleRoles[0].id)
      setDraftPermissions([...visibleRoles[0].assignedPermissions])
    }
  }, [visibleRoles])

  const effectiveSelectedRoleId =
    selectedRoleId && visibleRoles.some((r) => r.id === selectedRoleId)
      ? selectedRoleId
      : (visibleRoles[0]?.id ?? null)

  const selectedRole = visibleRoles.find((r) => r.id === effectiveSelectedRoleId) ?? null

  const filteredRoles = (() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return visibleRoles
    return visibleRoles.filter(
      (r) =>
        r.name.toLowerCase().includes(normalized) ||
        r.description.toLowerCase().includes(normalized)
    )
  })()

  const roleDialog = usePermissionsRoleDialog({
    selectedRoleId: effectiveSelectedRoleId,
    selectedRole,
    permissionManagementUseCase,
    onRoleCreated: (newRole) => {
      setSelectedRoleId(newRole.id)
      setDraftPermissions([...newRole.assignedPermissions])
    },
  })

  const deleteDialog = usePermissionsDeleteDialog({
    selectedRoleId: effectiveSelectedRoleId,
    selectedRole,
    roles: visibleRoles,
    permissionManagementUseCase,
    onRoleDeleted: (_, nextRoles) => {
      if (nextRoles.length > 0) {
        setSelectedRoleId(nextRoles[0].id)
        setDraftPermissions([...nextRoles[0].assignedPermissions])
      } else {
        setSelectedRoleId(null)
        setDraftPermissions([])
      }
    },
  })

  const { mutateAsync: logoutAsync } = useMutation({
    mutationFn: async () => {
      const result = await authUseCase.logout()
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  })

  const { mutate: savePerms, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!effectiveSelectedRoleId) throw new Error("No role selected")
      const result = await permissionManagementUseCase.saveRolePermissions(
        effectiveSelectedRoleId,
        draftPermissions
      )
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissions"] }),
  })

  const status: PermissionsPageStatus = (() => {
    if (isPending || isFetching) return "loading"
    if (isError) return "error"
    if (!data) return "idle"
    if (!data.user) return "unauthenticated"
    return "success"
  })()

  function selectRole(roleId: string): void {
    const role = visibleRoles.find((r) => r.id === roleId)
    if (role) {
      setSelectedRoleId(roleId)
      setDraftPermissions([...role.assignedPermissions])
    }
  }

  function togglePermission(permission: PermissionCode): void {
    setDraftPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    )
  }

  function selectAllInCategory(categoryName: string): void {
    if (!config) return
    const category = config.categories.find((c) => c.name === categoryName)
    if (!category) return
    setDraftPermissions((current) => {
      const withoutCategory = current.filter((p) => !category.permissions.includes(p))
      return [...withoutCategory, ...category.permissions]
    })
  }

  function deselectAllInCategory(categoryName: string): void {
    if (!config) return
    const category = config.categories.find((c) => c.name === categoryName)
    if (!category) return
    setDraftPermissions((current) => current.filter((p) => !category.permissions.includes(p)))
  }

  function resetPermissions(): void {
    if (selectedRole) setDraftPermissions([...selectedRole.assignedPermissions])
  }

  async function savePermissions(): Promise<void> {
    savePerms()
  }

  async function reload(): Promise<void> {
    await refetch()
  }

  async function logout(): Promise<void> {
    await logoutAsync()
  }

  const isDirty = (() => {
    if (!selectedRole) return false
    const original = [...selectedRole.assignedPermissions].sort()
    const draft = [...draftPermissions].sort()
    if (original.length !== draft.length) return true
    return original.some((p, i) => p !== draft[i])
  })()

  const state: PermissionsViewModelState = {
    status,
    user,
    roles: visibleRoles,
    filteredRoles,
    config,
    selectedRoleId: effectiveSelectedRoleId,
    selectedRole,
    draftPermissions,
    searchQuery,
    isSaving,
    isSavingRole: roleDialog.isSavingRole,
    isDeletingRole: deleteDialog.isDeletingRole,
    roleDialogMode: roleDialog.roleDialogMode,
    roleForm: roleDialog.roleForm,
    roleFormNameError: roleDialog.roleFormNameError,
    roleFormError: roleDialog.roleFormError,
    deleteRoleDialog: deleteDialog.deleteRoleDialog,
    deleteRoleError: deleteDialog.deleteRoleError,
    error: isError ? error?.message ?? null : null,
    isLoading: isPending || isFetching,
    isReady: status === "success",
    isUnauthenticated: status === "unauthenticated",
    isDirty,
    selectedCount: draftPermissions.length,
    totalCount: config?.totalPermissions ?? 0,
  }

  return {
    state,
    reload,
    logout,
    selectRole,
    setSearchQuery,
    togglePermission,
    selectAllInCategory,
    deselectAllInCategory,
    resetPermissions,
    savePermissions,
    openCreateRoleDialog: roleDialog.openCreateRoleDialog,
    openEditRoleDialog: roleDialog.openEditRoleDialog,
    closeRoleDialog: roleDialog.closeRoleDialog,
    setRoleFormName: roleDialog.setRoleFormName,
    setRoleFormDescription: roleDialog.setRoleFormDescription,
    submitRoleForm: roleDialog.submitRoleForm,
    openDeleteRoleDialog: deleteDialog.openDeleteRoleDialog,
    closeDeleteRoleDialog: deleteDialog.closeDeleteRoleDialog,
    confirmDeleteRole: deleteDialog.confirmDeleteRole,
  }
}
