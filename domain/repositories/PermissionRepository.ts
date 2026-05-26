import type {
  PermissionCode,
  PermissionConfig,
  PermissionStaffMember,
} from "@/domain/entities/permission/Permission"
import type { Result } from "@/domain/result/Result"

export interface PermissionRepository {
  getPermissionStaff(): Promise<Result<PermissionStaffMember[]>>
  getPermissionConfig(): Promise<Result<PermissionConfig>>
  savePermissions(
    staffId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionStaffMember>>
}
