export type PermissionCode = string

export type PermissionCategory = {
  name: string
  permissions: PermissionCode[]
}

export type PermissionStaffRole =
  | "branch_admin"
  | "sub_branch_admin"
  | "staff"

export type PermissionStaffMember = {
  id: string
  name: string
  email: string
  role: PermissionStaffRole
  branch: string
  assignedPermissions: PermissionCode[]
  isRoleLocked: boolean
}

export type PermissionConfig = {
  categories: PermissionCategory[]
  totalPermissions: number
}
