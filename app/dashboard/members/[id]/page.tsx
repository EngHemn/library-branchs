"use client"

import { use } from "react"

import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { ViewMemberScreen } from "@/presentation/screens/members/ViewMemberScreen"

type ViewMemberPageProps = {
  params: Promise<{
    id: string
  }>
}

const memberManagementFakeDataSource = new MemberManagementFakeDataSource()
const memberManagementRepository = new MemberManagementRepositoryImpl(
  memberManagementFakeDataSource
)
const memberManagementUseCase = new MemberManagementUseCase(
  memberManagementRepository
)

export default function ViewMemberPage({ params }: ViewMemberPageProps) {
  const { id } = use(params)

  return (
    <ViewMemberScreen
      memberId={id}
      memberManagementUseCase={memberManagementUseCase}
    />
  )
}
