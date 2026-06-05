"use client"

import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MembersScreen } from "@/presentation/screens/members/MembersScreen"

const memberManagementFakeDataSource = new MemberManagementFakeDataSource()
const memberManagementRepository = new MemberManagementRepositoryImpl(
  memberManagementFakeDataSource
)
const memberManagementUseCase = new MemberManagementUseCase(
  memberManagementRepository
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
    <MembersScreen
      memberManagementUseCase={memberManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
