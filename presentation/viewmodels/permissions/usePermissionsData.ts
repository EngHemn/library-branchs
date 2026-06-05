"use client"

import { useQuery } from "@tanstack/react-query"

import type { PermissionConfig, PermissionRole } from "@/domain/entities/permission/Permission"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"

export type PermissionsQueryData = {
  user: User | null
  roles: PermissionRole[]
  config: PermissionConfig | null
}

export type PermissionsDataResult = {
  data: PermissionsQueryData | undefined
  isPending: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<unknown>
}

export function usePermissionsData(
  authUseCase: AuthUseCase,
  permissionManagementUseCase: PermissionManagementUseCase
): PermissionsDataResult {
  const { data, isPending, isFetching, isError, error, refetch } =
    useQuery<PermissionsQueryData>({
      queryKey: ["permissions"],
      queryFn: async () => {
        const currentUserResult = await authUseCase.getCurrentUser()
        if (!currentUserResult.success) throw new Error(currentUserResult.error)
        if (!currentUserResult.data) return { user: null, roles: [], config: null }

        const [rolesResult, configResult] = await Promise.all([
          permissionManagementUseCase.getPermissionRoles(),
          permissionManagementUseCase.getPermissionConfig(),
        ])

        if (!rolesResult.success) throw new Error(rolesResult.error)
        if (!configResult.success) throw new Error(configResult.error)

        return {
          user: currentUserResult.data,
          roles: rolesResult.data,
          config: configResult.data,
        }
      },
    })

  return {
    data,
    isPending,
    isFetching,
    isError,
    error: error instanceof Error ? error : null,
    refetch,
  }
}
