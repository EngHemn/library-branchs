import type { PermissionRole } from "@/domain/entities/permission/Permission"
import type { User } from "@/domain/entities/User"
import { isBranchScopedDashboardUser } from "@/lib/dashboardBranchScope"

export function isBranchScopedStaffPermissionsUser(
  user: Pick<User, "branchType" | "loginType">
): boolean {
  return isBranchScopedDashboardUser(user)
}

export function canAssignBranchAdminRole(
  user: Pick<User, "branchType" | "loginType"> | null | undefined
): boolean {
  if (!user) return true
  return !isBranchScopedStaffPermissionsUser(user)
}

export function filterPermissionRolesForUser(
  roles: PermissionRole[],
  user: Pick<User, "branchType" | "loginType">
): PermissionRole[] {
  if (!isBranchScopedStaffPermissionsUser(user)) {
    return roles
  }

  return roles.filter((role) => role.id !== "branch_admin")
}
