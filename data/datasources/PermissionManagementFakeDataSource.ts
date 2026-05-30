import type {
  CreatePermissionRoleInput,
  PermissionCode,
  PermissionConfig,
  PermissionRole,
  UpdatePermissionRoleInput,
} from "@/domain/entities/permission/Permission"
import type { Result } from "@/domain/result/Result"
import {
  fakePermissionConfig,
  fakePermissionRoles,
} from "@/data/fake/fakePermissions"
import { fakeStaff } from "@/data/fake/fakeStaff"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function slugifyRoleName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function createUniqueRoleId(name: string, existingIds: string[]): string {
  const baseId = slugifyRoleName(name) || "custom_role"
  let candidate = baseId
  let suffix = 2

  while (existingIds.includes(candidate)) {
    candidate = `${baseId}_${suffix}`
    suffix += 1
  }

  return candidate
}

export class PermissionManagementFakeDataSource {
  private roles: PermissionRole[] = fakePermissionRoles.map((role) => ({
    ...role,
    assignedPermissions: [...role.assignedPermissions],
  }))

  async getPermissionRoles(): Promise<Result<PermissionRole[]>> {
    await delay(500)

    return {
      success: true,
      data: this.roles.map((role) => ({
        ...role,
        assignedPermissions: [...role.assignedPermissions],
      })),
    }
  }

  async getPermissionConfig(): Promise<Result<PermissionConfig>> {
    await delay(200)

    return {
      success: true,
      data: fakePermissionConfig,
    }
  }

  async createRole(
    input: CreatePermissionRoleInput
  ): Promise<Result<PermissionRole>> {
    await delay(400)

    const trimmedName = input.name.trim()

    if (!trimmedName) {
      return {
        success: false,
        error: "Role name is required",
      }
    }

    const normalizedName = trimmedName.toLowerCase()
    const nameExists = this.roles.some(
      (role) => role.name.trim().toLowerCase() === normalizedName
    )

    if (nameExists) {
      return {
        success: false,
        error: "A role with this name already exists",
      }
    }

    const newRole: PermissionRole = {
      id: createUniqueRoleId(trimmedName, this.roles.map((role) => role.id)),
      name: trimmedName,
      description: input.description.trim(),
      assignedPermissions: [],
      isSystem: false,
    }

    this.roles = [...this.roles, newRole]

    return {
      success: true,
      data: {
        ...newRole,
        assignedPermissions: [...newRole.assignedPermissions],
      },
    }
  }

  async updateRole(
    roleId: string,
    input: UpdatePermissionRoleInput
  ): Promise<Result<PermissionRole>> {
    await delay(400)

    const roleIndex = this.roles.findIndex((role) => role.id === roleId)

    if (roleIndex === -1) {
      return {
        success: false,
        error: "Role not found",
      }
    }

    const trimmedName = input.name.trim()

    if (!trimmedName) {
      return {
        success: false,
        error: "Role name is required",
      }
    }

    const normalizedName = trimmedName.toLowerCase()
    const nameExists = this.roles.some(
      (role) =>
        role.id !== roleId &&
        role.name.trim().toLowerCase() === normalizedName
    )

    if (nameExists) {
      return {
        success: false,
        error: "A role with this name already exists",
      }
    }

    const role = this.roles[roleIndex]

    const updatedRole: PermissionRole = {
      ...role,
      name: trimmedName,
      description: input.description.trim(),
    }

    this.roles = this.roles.map((item) =>
      item.id === roleId ? updatedRole : item
    )

    return {
      success: true,
      data: {
        ...updatedRole,
        assignedPermissions: [...updatedRole.assignedPermissions],
      },
    }
  }

  async deleteRole(roleId: string): Promise<Result<null>> {
    await delay(400)

    const role = this.roles.find((item) => item.id === roleId)

    if (!role) {
      return {
        success: false,
        error: "Role not found",
      }
    }

    if (role.isSystem) {
      return {
        success: false,
        error: "System roles cannot be deleted",
      }
    }

    const staffUsingRole = fakeStaff.some((member) => member.role === roleId)

    if (staffUsingRole) {
      return {
        success: false,
        error: "Cannot delete a role that is assigned to staff members",
      }
    }

    this.roles = this.roles.filter((item) => item.id !== roleId)

    return {
      success: true,
      data: null,
    }
  }

  async saveRolePermissions(
    roleId: string,
    permissions: PermissionCode[]
  ): Promise<Result<PermissionRole>> {
    await delay(400)

    const roleIndex = this.roles.findIndex((role) => role.id === roleId)

    if (roleIndex === -1) {
      return {
        success: false,
        error: "Role not found",
      }
    }

    const role = this.roles[roleIndex]

    const updatedRole: PermissionRole = {
      ...role,
      assignedPermissions: permissions,
    }

    this.roles = this.roles.map((item) =>
      item.id === roleId ? updatedRole : item
    )

    return {
      success: true,
      data: {
        ...updatedRole,
        assignedPermissions: [...updatedRole.assignedPermissions],
      },
    }
  }
}
