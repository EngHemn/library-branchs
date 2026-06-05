"use client"

<<<<<<< HEAD
import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
=======
import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { BranchManagementRepositoryImpl } from "@/data/repositories/BranchManagementRepositoryImpl"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MembersScreen } from "@/presentation/screens/members/MembersScreen"

<<<<<<< HEAD
const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
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
<<<<<<< HEAD
      authUseCase={authUseCase}
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
      memberManagementUseCase={memberManagementUseCase}
      branchManagementUseCase={branchManagementUseCase}
    />
  )
}
