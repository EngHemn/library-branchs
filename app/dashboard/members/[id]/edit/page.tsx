"use client"

import { use } from "react"

import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import { MemberManagementRepositoryImpl } from "@/data/repositories/MemberManagementRepositoryImpl"
import { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { EditMemberScreen } from "@/presentation/screens/members/EditMemberScreen"

type EditMemberPageProps = {
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

export default function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = use(params)

  return (
    <EditMemberScreen
      memberId={id}
      memberManagementUseCase={memberManagementUseCase}
    />
  )
}
