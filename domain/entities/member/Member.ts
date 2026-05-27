export type MemberStatus = "active" | "inactive" | "suspended"

export type Member = {
  id: string
  memberId: string
  memberName: string
  membershipNumber: string
  registerBranch: string
  allBranchesUsed: string[]
  email: string
  phone: string
  registrationDate: string
  activeBookings: number
  status: MemberStatus
  branchId: string
}
