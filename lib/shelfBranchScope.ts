import { fakeBranches } from "@/data/fake/fakeBranches"
import type { Shelf, ShelfSummary } from "@/domain/entities/shelf/Shelf"
import type { User } from "@/domain/entities/User"
import type { ShelfBranchOption } from "@/domain/repositories/ShelfManagementRepository"
import {
  getDashboardBranchScope,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

export function getShelfDashboardBranchScope(user: User) {
  return getDashboardBranchScope(user, allDashboardBranches)
}

export function getShelfBranchFormOptions(user: User): ShelfBranchOption[] {
  const branchScope = getShelfDashboardBranchScope(user)

  return branchScope.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }))
}

export function getDefaultShelfBranchId(user: User): string {
  return resolveUserBranchId(user)
}

export function getScopedShelfBranchIds(user: User): string[] {
  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

export function filterShelvesByBranchScope(
  shelves: Shelf[],
  user: User
): Shelf[] {
  const scopedBranchIds = getScopedShelfBranchIds(user)

  if (user.branchType === "sub") {
    const userBranchId = resolveUserBranchId(user)
    return shelves.filter((shelf) => shelf.branchId === userBranchId)
  }

  return shelves.filter((shelf) => scopedBranchIds.includes(shelf.branchId))
}

export function buildScopedShelfSummary(shelves: Shelf[]): ShelfSummary {
  return {
    totalShelves: shelves.length,
    mainBranchShelves: shelves.filter((shelf) => shelf.branchType === "main")
      .length,
    subBranchShelves: shelves.filter((shelf) => shelf.branchType === "sub")
      .length,
    activeShelves: shelves.filter((shelf) => shelf.status === "active").length,
  }
}
