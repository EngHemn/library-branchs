import { fakeBranches } from "@/data/fake/fakeBranches"

export function getBranchViewHref(branchId: string): string {
  return `/dashboard/branches/${branchId}`
}

export function getBranchLocationTabHref(branchId: string): string {
  return `/dashboard/branches/${branchId}?tab=location`
}

export function getParentBranchViewHref(branchId: string): string | null {
  const branch = fakeBranches.find((item) => item.id === branchId)

  if (!branch?.parentBranch) {
    return null
  }

  const parent = fakeBranches.find(
    (item) => item.branchName === branch.parentBranch
  )

  if (!parent) {
    return null
  }

  return getBranchViewHref(parent.id)
}

export function getBranchTypeLabel(branchId: string): "main" | "sub" | null {
  const branch = fakeBranches.find((item) => item.id === branchId)
  return branch?.type ?? null
}
