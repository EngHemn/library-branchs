"use client"

import { use } from "react"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { ViewMemberScreen } from "@/presentation/screens/members/ViewMemberScreen"

type ViewMemberPageProps = {
  params: Promise<{
    id: string
  }>
}

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

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

export default function ViewMemberPage({ params }: ViewMemberPageProps) {
  const { id } = use(params)

  return (
    <ViewMemberScreen
      memberId={id}
      memberManagementUseCase={memberManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
      authUseCase={authUseCase}
    />
  )
}
