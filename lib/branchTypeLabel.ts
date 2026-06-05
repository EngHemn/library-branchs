import type { BranchType } from "@/domain/entities/branch/Branch"

const branchTypeLabels: Record<BranchType, string> = {
  main: "Main Branch",
  sub: "Sub Branch",
}

export function getBranchTypeLabel(branchType: BranchType | undefined): string {
  if (!branchType) return ""
  return branchTypeLabels[branchType]
}
