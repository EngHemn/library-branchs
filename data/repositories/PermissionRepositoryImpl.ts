import type {
  CreatePermissionRoleInput,
  PermissionCode,
  PermissionConfig,
  PermissionRole,
  UpdatePermissionRoleInput,
} from "@/domain/entities/permission/Permission"
import type { PermissionRepository } from "@/domain/repositories/PermissionRepository"
import type { Result } from "@/domain/result/Result"
import type { PermissionManagementFakeDataSource } from "@/data/datasources/PermissionManagementFakeDataSource"

export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    private readonly dataSource: PermissionManagementFakeDataSource
  ) {}

  getPermissionRoles(): Promise<Result<PermissionRole[]>> {
    return this.dataSource.getPermissionRoles()
  }

  getPermissionConfig(): Promise<Result<PermissionConfig>> {
    return this.dataSource.getPermissionConfig()
  }

  createRole(
    input: CreatePermissionRoleInput
  ): Promise<Result<PermissionRole>> {
    return this.dataSource.createRole(input)
  }

  updateRole(
    roleId: string,
    input: UpdatePermissionRoleInput
  ): Promise<Result<PermissionRole>> {
    return this.dataSource.updateRole(roleId, input)
  }

  deleteRole(roleId: string): Promise<Result<null>> {
    return this.dataSource.deleteRole(roleId)
  }

  saveRolePermissions(
    roleId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionRole>> {
    return this.dataSource.saveRolePermissions(roleId, permissions)
  }
}
