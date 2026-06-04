import type { BranchType } from "@/domain/entities/branch/Branch"

export type LoginCredentials = {
  username: string
  password: string
  branchType: BranchType
}
