import { fakeBranches } from "@/data/fake/fakeBranches"
import type { User } from "@/domain/entities/User"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

export type BookBranchOption = {
  id: string
  name: string
}

export function isBranchScopedBooksUser(
  user: Pick<User, "branchType" | "loginType">
): boolean {
  return isBranchScopedDashboardUser(user)
}

export function getBookBranchFormOptions(user: User): BookBranchOption[] {
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  return branchScope.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }))
}

export function getDefaultBookBranchId(user: User): string {
  return resolveUserBranchId(user)
}
