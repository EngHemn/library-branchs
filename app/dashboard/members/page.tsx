"use client"

import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MembersScreen } from "@/presentation/screens/members/MembersScreen"

const memberManagementFakeDataSource = new MemberManagementFakeDataSource()
const memberManagementRepository = new MemberManagementRepositoryImpl(
  memberManagementFakeDataSource
)
const memberManagementUseCase = new MemberManagementUseCase(
  memberManagementRepository
)

export default function Page() {
  return <MembersScreen memberManagementUseCase={memberManagementUseCase} />
}
