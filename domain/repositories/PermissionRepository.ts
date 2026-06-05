import type {
  CreatePermissionRoleInput,
  PermissionCode,
  PermissionConfig,
  PermissionRole,
  UpdatePermissionRoleInput,
} from "@/domain/entities/permission/Permission"
import type { Result } from "@/domain/result/Result"

export interface PermissionRepository {
  getPermissionRoles(): Promise<Result<PermissionRole[]>>
  getPermissionConfig(): Promise<Result<PermissionConfig>>
  createRole(input: CreatePermissionRoleInput): Promise<Result<PermissionRole>>
  updateRole(
    roleId: string,
    input: UpdatePermissionRoleInput
  ): Promise<Result<PermissionRole>>
  deleteRole(roleId: string): Promise<Result<null>>
  saveRolePermissions(
    roleId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionRole>>
}
