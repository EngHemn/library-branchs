"use client"

import type {
  PermissionCode,
  PermissionConfig,
  PermissionRole,
} from "@/domain/entities/permission/Permission"
import type { User } from "@/domain/entities/User"
import type { RoleDialogMode, RoleFormState } from "./usePermissionsRoleDialog"

export type PermissionsPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

export type PermissionsViewModelState = {
  status: PermissionsPageStatus
  user: User | null
  roles: PermissionRole[]
  filteredRoles: PermissionRole[]
  config: PermissionConfig | null
  selectedRoleId: string | null
  selectedRole: PermissionRole | null
  draftPermissions: PermissionCode[]
  searchQuery: string
  isSaving: boolean
  isSavingRole: boolean
  isDeletingRole: boolean
  roleDialogMode: RoleDialogMode | null
  roleForm: RoleFormState
  roleFormNameError: string | null
  roleFormError: string | null
  deleteRoleDialog: {
    roleId: string
    roleName: string
    isSystem: boolean
  } | null
  deleteRoleError: string | null
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
  isDirty: boolean
  selectedCount: number
  totalCount: number
}
