import { fakeBranches } from "@/data/fake/fakeBranches"
import type { NeedListItem, NeedSummary } from "@/domain/entities/need/Need"
import type { User } from "@/domain/entities/User"
import type { NeedBranchOption } from "@/domain/repositories/NeedRepository"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

export function getNeedDashboardBranchScope(user: User) {
  return getDashboardBranchScope(user, allDashboardBranches)
}

export function getNeedBranchFormOptions(user: User): NeedBranchOption[] {
  const branchScope = getNeedDashboardBranchScope(user)

  return branchScope.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }))
}

export function getDefaultNeedBranchId(user: User): string {
  return resolveUserBranchId(user)
}

export function getScopedNeedBranchIds(user: User): string[] {
  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

export function filterNeedsByBranchScope(
  needs: NeedListItem[],
  user: User
): NeedListItem[] {
  const scopedBranchIds = getScopedNeedBranchIds(user)

  if (isBranchScopedDashboardUser(user)) {
    const userBranchId = resolveUserBranchId(user)
    return needs.filter((need) => need.branchId === userBranchId)
  }

  return needs.filter((need) => scopedBranchIds.includes(need.branchId))
}

export function buildScopedNeedSummary(needs: NeedListItem[]): NeedSummary {
  return {
    totalRequests: needs.length,
    pendingRequests: needs.filter((need) => need.status === "pending").length,
    approvedRequests: needs.filter((need) => need.status === "approved").length,
    criticalRequests: needs.filter(
      (need) =>
        need.priority === "critical" &&
        !["completed", "rejected", "draft"].includes(need.status)
    ).length,
  }
}

export function getCriticalNeedRequests(needs: NeedListItem[]): NeedListItem[] {
  return needs
    .filter(
      (need) =>
        need.priority === "critical" &&
        !["completed", "rejected", "draft"].includes(need.status)
    )
    .slice(0, 5)
}
