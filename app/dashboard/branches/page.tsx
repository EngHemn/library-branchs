"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { BranchManagementPage } from "@/presentation/screens/branch-management/BranchManagementPage"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const branchManagementFakeDataSource = new BranchManagementFakeDataSource()
const branchManagementRepository = new BranchManagementRepositoryImpl(
  branchManagementFakeDataSource
)
const branchManagementUseCase = new BranchManagementUseCase(
  branchManagementRepository
)

export default function Page() {
  return (
    <BranchManagementPage
      authUseCase={authUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
