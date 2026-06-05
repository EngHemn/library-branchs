import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type {
  CreateStaffInput,
  StaffManagementRepository,
  UpdateStaffInput,
} from "@/domain/repositories/StaffManagementRepository"
import type { Result } from "@/domain/result/Result"

export class StaffManagementUseCase {
  constructor(
    private readonly staffManagementRepository: StaffManagementRepository
  ) {}

  getStaff(): Promise<Result<StaffMember[]>> {
    return this.staffManagementRepository.getStaff()
  }

  getStaffById(staffId: string): Promise<Result<StaffMember | null>> {
    return this.staffManagementRepository.getStaffById(staffId)
  }

  createStaff(input: CreateStaffInput): Promise<Result<StaffMember>> {
    return this.staffManagementRepository.createStaff(input)
  }

  updateStaff(
    staffId: string,
    input: UpdateStaffInput
  ): Promise<Result<StaffMember>> {
    return this.staffManagementRepository.updateStaff(staffId, input)
  }

  deleteStaff(staffId: string): Promise<Result<null>> {
    return this.staffManagementRepository.deleteStaff(staffId)
  }

  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    return this.staffManagementRepository.toggleStaffStatus(staffId)
  }
}
