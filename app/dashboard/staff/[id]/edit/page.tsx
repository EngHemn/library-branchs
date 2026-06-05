"use client"

import { use } from "react"
import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { StaffManagementRepositoryImpl } from "@/data/repositories/StaffManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { EditStaffScreen } from "@/presentation/screens/staff-management/EditStaffScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

type EditStaffPageProps = {
  params: Promise<{
    id: string
  }>
}

const staffManagementFakeDataSource = new StaffManagementFakeDataSource()
const staffManagementRepository = new StaffManagementRepositoryImpl(
  staffManagementFakeDataSource
)
const staffManagementUseCase = new StaffManagementUseCase(
  staffManagementRepository
)

const branchManagementFakeDataSource = new BranchManagementFakeDataSource()
const branchManagementRepository = new BranchManagementRepositoryImpl(
  branchManagementFakeDataSource
)
const branchManagementUseCase = new BranchManagementUseCase(
  branchManagementRepository
)

export default function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = use(params)

  return (
    <EditStaffScreen
      staffId={id}
      authUseCase={authUseCase}
      staffManagementUseCase={staffManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
