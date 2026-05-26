"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { StaffManagementRepositoryImpl } from "@/data/repositories/StaffManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { StaffManagementPage } from "@/presentation/screens/staff-management/StaffManagementPage"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const staffManagementFakeDataSource = new StaffManagementFakeDataSource()
const staffManagementRepository = new StaffManagementRepositoryImpl(
  staffManagementFakeDataSource
)
const staffManagementUseCase = new StaffManagementUseCase(
  staffManagementRepository
)

export default function Page() {
  return (
    <StaffManagementPage
      authUseCase={authUseCase}
      staffManagementUseCase={staffManagementUseCase}
    />
  )
}
