import type { BranchType } from "@/domain/entities/branch/Branch"
import type { LoginType } from "@/domain/entities/LoginType"

export type User = {
  id: string
  username: string
  fullName: string
  role: string
  branchType: BranchType
  loginType: LoginType
  branchId: string
}
