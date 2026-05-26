"use client"

import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { EditBranchScreen } from "@/presentation/screens/branch-management/EditBranchScreen"
import { use } from "react"

type EditBranchPageProps = {
  params: Promise<{
    id: string
  }>
}

const branchManagementFakeDataSource = new BranchManagementFakeDataSource()
const branchManagementRepository = new BranchManagementRepositoryImpl(
  branchManagementFakeDataSource
)
const branchManagementUseCase = new BranchManagementUseCase(
  branchManagementRepository
)

export default function EditBranchPage({ params }: EditBranchPageProps) {
  const { id } = use(params)

  return (
    <EditBranchScreen
      branchId={id}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
