export type MemberStatus = "active" | "inactive" | "suspended"

export type Member = {
  id: string
  memberName: string
  registerBranch: string
  branchesUsed: number
  email: string
  phone: string
  activeBookings: number
  status: MemberStatus
  branchId: string
}
