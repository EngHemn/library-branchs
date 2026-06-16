import { fakeBranches } from "@/data/fake/fakeBranches"
import type { GroupListItem, GroupSummary } from "@/domain/entities/group/Group"
import type { User } from "@/domain/entities/User"
import type { GroupBranchOption } from "@/domain/repositories/GroupRepository"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

export function getGroupBranchFormOptions(user: User): GroupBranchOption[] {
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  return branchScope.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }))
}

export function getDefaultGroupBranchId(user: User): string {
  return resolveUserBranchId(user)
}

export function getScopedGroupBranchIds(user: User): string[] {
  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

export function filterGroupsByBranchScope(
  groups: GroupListItem[],
  user: User
): GroupListItem[] {
  const scopedBranchIds = getScopedGroupBranchIds(user)

  if (isBranchScopedDashboardUser(user)) {
    const userBranchId = resolveUserBranchId(user)
    return groups.filter((group) => group.branchId === userBranchId)
  }

  return groups.filter((group) => scopedBranchIds.includes(group.branchId))
}

export function buildScopedGroupSummary(groups: GroupListItem[]): GroupSummary {
  const activeGroups = groups.filter((group) => group.status === "active")

  return {
    totalGroups: groups.length,
    activeGroups: activeGroups.length,
    totalAssignedBooks: groups.reduce(
      (total, group) => total + group.totalBooks,
      0
    ),
    totalAssignedStaff: groups.reduce(
      (total, group) => total + group.assignedStaff,
      0
    ),
  }
}
