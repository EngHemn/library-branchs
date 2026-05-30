import type { StaffMember, StaffRole } from "@/domain/entities/staff/StaffMember"
import type { Result } from "@/domain/result/Result"

export type CreateStaffInput = {
  staffName: string
  role: StaffRole
  branchId: string
  branch: string
  email: string
  phone: string
  password: string
}

export type UpdateStaffInput = {
  staffName: string
  role: StaffRole
  branchId: string
  branch: string
  email: string
  phone: string
  password?: string
}

export interface StaffManagementRepository {
  getStaff(): Promise<Result<StaffMember[]>>
  getStaffById(staffId: string): Promise<Result<StaffMember | null>>
  createStaff(input: CreateStaffInput): Promise<Result<StaffMember>>
  updateStaff(staffId: string, input: UpdateStaffInput): Promise<Result<StaffMember>>
  deleteStaff(staffId: string): Promise<Result<null>>
  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>>
}
