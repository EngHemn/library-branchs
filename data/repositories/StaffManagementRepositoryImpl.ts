import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type {
  CreateStaffInput,
  StaffManagementRepository,
  UpdateStaffInput,
} from "@/domain/repositories/StaffManagementRepository"
import type { Result } from "@/domain/result/Result"

export class StaffManagementRepositoryImpl implements StaffManagementRepository {
  constructor(
    private readonly staffManagementFakeDataSource: StaffManagementFakeDataSource
  ) {}

  getStaff(): Promise<Result<StaffMember[]>> {
    return this.staffManagementFakeDataSource.getStaff()
  }

  getStaffById(staffId: string): Promise<Result<StaffMember | null>> {
    return this.staffManagementFakeDataSource.getStaffById(staffId)
  }

  createStaff(input: CreateStaffInput): Promise<Result<StaffMember>> {
    return this.staffManagementFakeDataSource.createStaff(input)
  }

  updateStaff(
    staffId: string,
    input: UpdateStaffInput
  ): Promise<Result<StaffMember>> {
    return this.staffManagementFakeDataSource.updateStaff(staffId, input)
  }

  deleteStaff(staffId: string): Promise<Result<null>> {
    return this.staffManagementFakeDataSource.deleteStaff(staffId)
  }

  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    return this.staffManagementFakeDataSource.toggleStaffStatus(staffId)
  }
}
