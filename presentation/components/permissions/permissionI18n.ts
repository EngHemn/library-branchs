import type { PermissionRole } from "@/domain/entities/permission/Permission"
import type { TranslationKey } from "@/presentation/i18n/messages"

const SYSTEM_ROLE_NAME_KEYS: Record<string, TranslationKey> = {
  branch_admin: "permissions.systemRoles.branch_admin.name",
  sub_branch_admin: "permissions.systemRoles.sub_branch_admin.name",
  staff: "permissions.systemRoles.staff.name",
}

const SYSTEM_ROLE_DESCRIPTION_KEYS: Record<string, TranslationKey> = {
  branch_admin: "permissions.systemRoles.branch_admin.description",
  sub_branch_admin: "permissions.systemRoles.sub_branch_admin.description",
  staff: "permissions.systemRoles.staff.description",
}

const PERMISSION_ERROR_KEYS: Record<string, TranslationKey> = {
  "Role name is required": "permissions.errors.roleNameRequired",
  "A role with this name already exists": "permissions.errors.roleNameExists",
  "Role not found": "permissions.errors.roleNotFound",
  "System roles cannot be deleted": "permissions.errors.systemRoleCannotDelete",
  "Cannot delete a role that is assigned to staff members":
    "permissions.errors.roleAssignedToStaff",
}

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  Books: "permissions.categories.Books",
  Authors: "permissions.categories.Authors",
  Translators: "permissions.categories.Translators",
  Categories: "permissions.categories.Categories",
  Members: "permissions.categories.Members",
  Groups: "permissions.categories.Groups",
  Bookings: "permissions.categories.Bookings",
  Needs: "permissions.categories.Needs",
  Alerts: "permissions.categories.Alerts",
}

type Translate = (
  key: TranslationKey,
  params?: Record<string, string | number>
) => string

export function getPermissionRoleName(
  role: PermissionRole,
  t: Translate
): string {
  const key = SYSTEM_ROLE_NAME_KEYS[role.id]
  return key ? t(key) : role.name
}

export function getPermissionRoleDescription(
  role: PermissionRole,
  t: Translate
): string | null {
  const key = SYSTEM_ROLE_DESCRIPTION_KEYS[role.id]
  if (key) {
    return t(key)
  }
  return role.description.trim() ? role.description : null
}

export function translatePermissionError(
  message: string,
  t: Translate
): string {
  const key = PERMISSION_ERROR_KEYS[message]
  return key ? t(key) : message
}

export function getPermissionCategoryName(
  categoryName: string,
  t: Translate
): string {
  const key = CATEGORY_KEYS[categoryName]
  return key ? t(key) : categoryName
}
