"use client"

import { use } from "react"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { GroupFakeDataSource } from "@/data/datasources/GroupFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { GroupRepositoryImpl } from "@/data/repositories/GroupRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import { ViewGroupScreen } from "@/presentation/screens/groups/ViewGroupScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const groupFakeDataSource = new GroupFakeDataSource()
const groupRepository = new GroupRepositoryImpl(groupFakeDataSource)
const groupManagementUseCase = new GroupManagementUseCase(groupRepository)

type ViewGroupPageProps = {
  params: Promise<{ id: string }>
}

export default function ViewGroupPage({ params }: ViewGroupPageProps) {
  const { id } = use(params)

  return (
    <ViewGroupScreen
      groupId={id}
      authUseCase={authUseCase}
      groupManagementUseCase={groupManagementUseCase}
    />
  )
}
