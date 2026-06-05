import type { Branch } from "@/domain/entities/branch/Branch"

export type BranchDetail = Branch & {
  logoUrl: string | null
  createdDate: string
  totalMembers: number
  totalSubBranches: number
}
