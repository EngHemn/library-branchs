export type PermissionCode = string

export type PermissionCategory = {
  name: string
  permissions: PermissionCode[]
}

export type PermissionStaffRole =
  | "branch_admin"
  | "sub_branch_admin"
  | "staff"

export const PERMISSION_ROLE_LABELS: Record<PermissionStaffRole, string> = {
  branch_admin: "Branch Admin",
  sub_branch_admin: "Sub-Branch Admin",
  staff: "Staff",
}

export type PermissionRole = {
  id: string
  name: string
  description: string
  assignedPermissions: PermissionCode[]
  isSystem: boolean
}

export type CreatePermissionRoleInput = {
  name: string
  description: string
}

export type UpdatePermissionRoleInput = {
  name: string
  description: string
}

export type PermissionConfig = {
  categories: PermissionCategory[]
  totalPermissions: number
}

export function getPermissionRoleLabel(roleId: string): string {
  return (
    PERMISSION_ROLE_LABELS[roleId as PermissionStaffRole] ??
    roleId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  )
}
