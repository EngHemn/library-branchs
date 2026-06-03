import type { PermissionStaffRole } from "@/domain/entities/permission/Permission"

export type StaffRole = PermissionStaffRole | (string & {})

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
  imageUrl?: string | null
}

export type StaffStats = {
  totalStaff: number
  activeStaff: number
  inactiveStaff: number
  branchAdmins: number
  subBranchAdmins: number
  staffMembers: number
}
