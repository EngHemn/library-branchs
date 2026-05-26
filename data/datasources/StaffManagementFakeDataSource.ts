import type {
  StaffMember,
  StaffPermission,
  StaffRole,
} from "@/domain/entities/staff/StaffMember"
import type {
  CreateStaffInput,
  UpdateStaffInput,
} from "@/domain/repositories/StaffManagementRepository"
import type { Result } from "@/domain/result/Result"
import { fakeStaff } from "@/data/fake/fakeStaff"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const defaultPermissionsByRole: Record<StaffRole, StaffPermission[]> = {
  manager: ["read", "write", "delete", "manage_staff", "manage_books"],
  librarian: ["read", "write", "manage_books"],
  assistant: ["read", "write"],
  clerk: ["read"],
  security: ["read"],
}

export class StaffManagementFakeDataSource {
  private staff: StaffMember[] = fakeStaff.map((member) => ({ ...member }))

  async getStaff(): Promise<Result<StaffMember[]>> {
    await delay(350)

    return {
      success: true,
      data: this.staff.map((member) => ({ ...member })),
    }
  }

  async getStaffById(staffId: string): Promise<Result<StaffMember | null>> {
    await delay(200)

    const member = this.staff.find((item) => item.id === staffId)

    return {
      success: true,
      data: member ? { ...member } : null,
    }
  }

  async createStaff(input: CreateStaffInput): Promise<Result<StaffMember>> {
    await delay(300)

    const newId = `ST-${String(this.staff.length + 1).padStart(3, "0")}`
    const newStaffId = `EMP-${String(this.staff.length + 1000 + 1)}`

    const newMember: StaffMember = {
      id: newId,
      staffName: input.staffName,
      staffId: newStaffId,
      role: input.role,
      branch: input.branch,
      email: input.email,
      phone: input.phone,
      permissions: defaultPermissionsByRole[input.role],
      status: "active",
      branchId: input.branchId,
    }

    this.staff = [...this.staff, newMember]

    return {
      success: true,
      data: { ...newMember },
    }
  }

  async updateStaff(
    staffId: string,
    input: UpdateStaffInput
  ): Promise<Result<StaffMember>> {
    await delay(300)

    const member = this.staff.find((item) => item.id === staffId)

    if (!member) {
      return {
        success: false,
        error: "Staff member could not be found.",
      }
    }

    const updatedMember: StaffMember = {
      ...member,
      staffName: input.staffName,
      role: input.role,
      branch: input.branch,
      email: input.email,
      phone: input.phone,
      permissions: defaultPermissionsByRole[input.role],
      branchId: input.branchId,
    }

    this.staff = this.staff.map((item) =>
      item.id === staffId ? updatedMember : item
    )

    return {
      success: true,
      data: { ...updatedMember },
    }
  }

  async deleteStaff(staffId: string): Promise<Result<null>> {
    await delay(200)

    const memberExists = this.staff.some((member) => member.id === staffId)

    if (!memberExists) {
      return {
        success: false,
        error: "Staff member could not be found.",
      }
    }

    this.staff = this.staff.filter((member) => member.id !== staffId)

    return {
      success: true,
      data: null,
    }
  }

  async toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    await delay(200)

    const member = this.staff.find((item) => item.id === staffId)

    if (!member) {
      return {
        success: false,
        error: "Staff member could not be found.",
      }
    }

    const updatedMember: StaffMember = {
      ...member,
      status: member.status === "active" ? "inactive" : "active",
    }

    this.staff = this.staff.map((item) =>
      item.id === staffId ? updatedMember : item
    )

    return {
      success: true,
      data: { ...updatedMember },
    }
  }
}
