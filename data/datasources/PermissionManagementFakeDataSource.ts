import type {
  PermissionCode,
  PermissionConfig,
  PermissionStaffMember,
} from "@/domain/entities/permission/Permission"
import type { Result } from "@/domain/result/Result"
import {
  fakePermissionConfig,
  fakePermissionStaff,
} from "@/data/fake/fakePermissions"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class PermissionManagementFakeDataSource {
  private staff: PermissionStaffMember[] = [...fakePermissionStaff]

  async getPermissionStaff(): Promise<Result<PermissionStaffMember[]>> {
    await delay(500)

    return {
      success: true,
      data: this.staff,
    }
  }

  async getPermissionConfig(): Promise<Result<PermissionConfig>> {
    await delay(200)

    return {
      success: true,
      data: fakePermissionConfig,
    }
  }

  async savePermissions(
    staffId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionStaffMember>> {
    await delay(400)

    const staffIndex = this.staff.findIndex((member) => member.id === staffId)

    if (staffIndex === -1) {
      return {
        success: false,
        error: "Staff member not found",
      }
    }

    const member = this.staff[staffIndex]

    if (member.isRoleLocked) {
      return {
        success: false,
        error: "Cannot edit permissions for role-locked staff members",
      }
    }

    const updatedMember: PermissionStaffMember = {
      ...member,
      assignedPermissions: permissions,
    }

    this.staff = this.staff.map((s) => (s.id === staffId ? updatedMember : s))

    return {
      success: true,
      data: updatedMember,
    }
  }
}
