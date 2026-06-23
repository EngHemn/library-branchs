import type { BranchType } from "@/domain/entities/branch/Branch"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"

export function getBranchPermissions(
  branchType: BranchType
): BranchPermissions {
  if (branchType === "main") {
    return {
      canEdit: true,
      canDelete: true,
      canDeactivate: true,
      canManageSubBranches: true,
      canViewSubBranches: true,
      canManageBooks: true,
      canManageAuthors: true,
      canManageTranslators: true,
      canManageStaff: true,
      canManageMembers: true,
    }
  }

  return {
    canEdit: false,
    canDelete: false,
    canDeactivate: false,
    canManageSubBranches: false,
    canViewSubBranches: false,
    canManageBooks: false,
    canManageAuthors: false,
    canManageTranslators: false,
    canManageStaff: false,
    canManageMembers: false,
  }
}
