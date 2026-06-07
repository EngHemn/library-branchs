"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { GroupFakeDataSource } from "@/data/datasources/GroupFakeDataSource"
import { GroupRepositoryImpl } from "@/data/repositories/GroupRepositoryImpl"
import { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import { GroupsScreen } from "@/presentation/screens/groups/GroupsScreen"

const groupFakeDataSource = new GroupFakeDataSource()
const groupRepository = new GroupRepositoryImpl(groupFakeDataSource)
const groupManagementUseCase = new GroupManagementUseCase(groupRepository)

export default function GroupsPage() {
  return (
    <GroupsScreen
      authUseCase={dashboardAuthUseCase}
      groupManagementUseCase={groupManagementUseCase}
    />
  )
}
