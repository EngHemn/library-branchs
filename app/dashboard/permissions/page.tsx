"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { PermissionManagementFakeDataSource } from "@/data/datasources/PermissionManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { PermissionRepositoryImpl } from "@/data/repositories/PermissionRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"
import { PermissionsScreen } from "@/presentation/screens/permissions/PermissionsScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const permissionFakeDataSource = new PermissionManagementFakeDataSource()
const permissionRepository = new PermissionRepositoryImpl(
  permissionFakeDataSource
)
const permissionManagementUseCase = new PermissionManagementUseCase(
  permissionRepository
)

export default function Page() {
  return (
    <PermissionsScreen
      authUseCase={authUseCase}
      permissionManagementUseCase={permissionManagementUseCase}
    />
  )
}
