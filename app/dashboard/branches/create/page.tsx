"use client"

import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { CreateBranchScreen } from "@/presentation/screens/branch-management/CreateBranchScreen"

const branchManagementFakeDataSource = new BranchManagementFakeDataSource()
const branchManagementRepository = new BranchManagementRepositoryImpl(
  branchManagementFakeDataSource
)
const branchManagementUseCase = new BranchManagementUseCase(
  branchManagementRepository
)

export default function CreateBranchPage() {
  return (
    <CreateBranchScreen
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
