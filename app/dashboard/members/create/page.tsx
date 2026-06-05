"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { CreateMemberScreen } from "@/presentation/screens/members/CreateMemberScreen"

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

export default function CreateMemberPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      }
    >
      <CreateMemberScreen
        authUseCase={authUseCase}
        memberManagementUseCase={memberManagementUseCase}
        branchManagementUseCase={branchManagementUseCase}
      />
    </Suspense>
  )
}
