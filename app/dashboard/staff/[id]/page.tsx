"use client"

import { use } from "react"
import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import { StaffManagementFakeDataSource } from "@/data/datasources/StaffManagementFakeDataSource"
import { BranchDetailRepositoryImpl } from "@/data/repositories/BranchDetailRepositoryImpl"
import { StaffManagementRepositoryImpl } from "@/data/repositories/StaffManagementRepositoryImpl"
import { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { ViewStaffScreen } from "@/presentation/screens/staff-management/ViewStaffScreen"

type ViewStaffPageProps = {
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

const branchDetailFakeDataSource = new BranchDetailFakeDataSource()
const branchDetailRepository = new BranchDetailRepositoryImpl(
  branchDetailFakeDataSource
)
const branchDetailUseCase = new BranchDetailUseCase(branchDetailRepository)

export default function ViewStaffPage({ params }: ViewStaffPageProps) {
  const { id } = use(params)

  return (
    <ViewStaffScreen
      staffId={id}
      staffManagementUseCase={staffManagementUseCase}
      branchDetailUseCase={branchDetailUseCase}
    />
  )
}
