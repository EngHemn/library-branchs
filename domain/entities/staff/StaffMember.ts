export type StaffRole = "librarian" | "manager" | "assistant" | "clerk" | "security"

export type StaffStatus = "active" | "inactive"

export type StaffMember = {
  id: string
  staffName: string
  staffId: string
  role: StaffRole
  branch: string
  email: string
  phone: string
  status: StaffStatus
  branchId: string
}
