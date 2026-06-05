import type {
  CreatePermissionRoleInput,
  PermissionCode,
  PermissionConfig,
  PermissionRole,
  UpdatePermissionRoleInput,
} from "@/domain/entities/permission/Permission"
import type { PermissionRepository } from "@/domain/repositories/PermissionRepository"
import type { Result } from "@/domain/result/Result"

export class PermissionManagementUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  getPermissionRoles(): Promise<Result<PermissionRole[]>> {
    return this.permissionRepository.getPermissionRoles()
  }

  getPermissionConfig(): Promise<Result<PermissionConfig>> {
    return this.permissionRepository.getPermissionConfig()
  }

  createRole(input: CreatePermissionRoleInput): Promise<Result<PermissionRole>> {
    return this.permissionRepository.createRole(input)
  }

  updateRole(
    roleId: string,
    input: UpdatePermissionRoleInput
  ): Promise<Result<PermissionRole>> {
    return this.permissionRepository.updateRole(roleId, input)
  }

  deleteRole(roleId: string): Promise<Result<null>> {
    return this.permissionRepository.deleteRole(roleId)
  }

  saveRolePermissions(
    roleId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionRole>> {
    return this.permissionRepository.saveRolePermissions(roleId, permissions)
  }
}
