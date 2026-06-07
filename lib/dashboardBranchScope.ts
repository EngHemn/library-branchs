import { fakeBranches } from "@/data/fake/fakeBranches"
import type { DashboardBranch } from "@/domain/entities/dashboard/DashboardSummary"
import type { User } from "@/domain/entities/User"

export type DashboardBranchScope = {
  branches: DashboardBranch[]
  branchIds: string[]
  defaultBranchId: string
  allowAllBranches: boolean
  /** Main-branch users can pick sub-branches; sub users see only their branch data. */
  showBranchFilter: boolean
}

const DEFAULT_MAIN_BRANCH_ID = "BR-001"
const DEFAULT_SUB_BRANCH_ID = "BR-002"

export function resolveUserBranchId(
  user: Pick<User, "branchType"> & { branchId?: string }
): string {
  if (user.branchId) return user.branchId
  return user.branchType === "sub" ? DEFAULT_SUB_BRANCH_ID : DEFAULT_MAIN_BRANCH_ID
}

export function getDashboardBranchScope(
  user: User,
  allBranches: DashboardBranch[]
): DashboardBranchScope {
  const branchId = resolveUserBranchId(user)

  if (user.branchType === "sub") {
    const branch =
      allBranches.find((item) => item.id === branchId) ??
      fakeBranches
        .filter((item) => item.id === branchId)
        .map((item) => ({ id: item.id, name: item.branchName }))[0]

    const branches = branch ? [branch] : []

    return {
      branches,
      branchIds: branch ? [branch.id] : [],
      defaultBranchId: branchId,
      allowAllBranches: false,
      showBranchFilter: false,
    }
  }

  const mainBranch = fakeBranches.find((item) => item.id === branchId)

  if (!mainBranch || mainBranch.type !== "main") {
    return {
      branches: allBranches,
      branchIds: allBranches.map((item) => item.id),
      defaultBranchId: "all",
      allowAllBranches: true,
      showBranchFilter: true,
    }
  }

  const scopedIds = new Set<string>([mainBranch.id])

  for (const branch of fakeBranches) {
    if (branch.type === "sub" && branch.parentBranch === mainBranch.branchName) {
      scopedIds.add(branch.id)
    }
  }

  const branches = allBranches.filter((item) => scopedIds.has(item.id))
  const branchIds = branches.map((item) => item.id)

  return {
    branches,
    branchIds,
    defaultBranchId: "all",
    allowAllBranches: true,
    showBranchFilter: true,
  }
}

export function matchesDashboardBranchFilter(
  itemBranchId: string,
  selectedBranchId: string,
  scopedBranchIds: string[]
): boolean {
  if (selectedBranchId !== "all") {
    return itemBranchId === selectedBranchId
  }

  return scopedBranchIds.includes(itemBranchId)
}

export function getSubBranchNetworkBranchIds(userBranchId: string): string[] {
  const userBranch = fakeBranches.find((item) => item.id === userBranchId)

  if (!userBranch || userBranch.type !== "sub") {
    return [userBranchId]
  }

  const parentName = userBranch.parentBranch
  if (!parentName) {
    return [userBranchId]
  }

  const networkIds = new Set<string>([userBranchId])

  for (const branch of fakeBranches) {
    if (branch.type === "main" && branch.branchName === parentName) {
      networkIds.add(branch.id)
    }

    if (branch.type === "sub" && branch.parentBranch === parentName) {
      networkIds.add(branch.id)
    }
  }

  return Array.from(networkIds)
}
