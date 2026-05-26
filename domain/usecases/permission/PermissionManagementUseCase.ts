import type {
  PermissionCode,
  PermissionConfig,
  PermissionStaffMember,
} from "@/domain/entities/permission/Permission"
import type { PermissionRepository } from "@/domain/repositories/PermissionRepository"
import type { Result } from "@/domain/result/Result"

export class PermissionManagementUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  getPermissionStaff(): Promise<Result<PermissionStaffMember[]>> {
    return this.permissionRepository.getPermissionStaff()
  }

  getPermissionConfig(): Promise<Result<PermissionConfig>> {
    return this.permissionRepository.getPermissionConfig()
  }

  savePermissions(
    staffId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionStaffMember>> {
    return this.permissionRepository.savePermissions(staffId, permissions)
  }
}
