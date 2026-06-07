"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { GroupFakeDataSource } from "@/data/datasources/GroupFakeDataSource"
import { GroupRepositoryImpl } from "@/data/repositories/GroupRepositoryImpl"
import { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import { EditGroupScreen } from "@/presentation/screens/groups/EditGroupScreen"

const groupFakeDataSource = new GroupFakeDataSource()
const groupRepository = new GroupRepositoryImpl(groupFakeDataSource)
const groupManagementUseCase = new GroupManagementUseCase(groupRepository)

type EditGroupPageProps = {
  params: Promise<{ id: string }>
}

export default function EditGroupPage({ params }: EditGroupPageProps) {
  const { id } = use(params)

  return (
    <EditGroupScreen
      groupId={id}
      authUseCase={dashboardAuthUseCase}
      groupManagementUseCase={groupManagementUseCase}
    />
  )
}
