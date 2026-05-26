export type StaffRole = "librarian" | "manager" | "assistant" | "clerk" | "security"

export type StaffStatus = "active" | "inactive"

export type StaffPermission = "read" | "write" | "delete" | "manage_staff" | "manage_books"

export type StaffMember = {
  id: string
  staffName: string
  staffId: string
  role: StaffRole
  branch: string
  email: string
  phone: string
  permissions: StaffPermission[]
  status: StaffStatus
  branchId: string
}

export type StaffStats = {
  totalStaff: number
  activeStaff: number
  inactiveStaff: number
  managers: number
  librarians: number
}
