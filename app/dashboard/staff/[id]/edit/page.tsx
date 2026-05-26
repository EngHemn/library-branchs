"use client"

import { use } from "react"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { StaffManagementRepositoryImpl } from "@/data/repositories/StaffManagementRepositoryImpl"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { EditStaffScreen } from "@/presentation/screens/staff-management/EditStaffScreen"

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
      staffManagementUseCase={staffManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
