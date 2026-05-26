import type {
  PermissionCode,
  PermissionConfig,
  PermissionStaffMember,
} from "@/domain/entities/permission/Permission"
import type { PermissionRepository } from "@/domain/repositories/PermissionRepository"
import type { Result } from "@/domain/result/Result"
import type { PermissionManagementFakeDataSource } from "@/data/datasources/PermissionManagementFakeDataSource"

export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    private readonly dataSource: PermissionManagementFakeDataSource
  ) {}

  getPermissionStaff(): Promise<Result<PermissionStaffMember[]>> {
    return this.dataSource.getPermissionStaff()
  }

  getPermissionConfig(): Promise<Result<PermissionConfig>> {
    return this.dataSource.getPermissionConfig()
  }

  savePermissions(
    staffId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionStaffMember>> {
    return this.dataSource.savePermissions(staffId, permissions)
  }
}
