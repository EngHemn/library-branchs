"use client"

import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { StaffManagementRepositoryImpl } from "@/data/repositories/StaffManagementRepositoryImpl"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { CreateStaffScreen } from "@/presentation/screens/staff-management/CreateStaffScreen"

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

export default function Page() {
  return (
    <CreateStaffScreen
      staffManagementUseCase={staffManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
