import type { BranchType } from "@/domain/entities/branch/Branch"

export type User = {
  id: string
  username: string
  fullName: string
  role: string
  branchType: BranchType
  branchId: string
}
