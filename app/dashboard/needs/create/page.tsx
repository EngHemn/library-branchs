"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { NeedFakeDataSource } from "@/data/datasources/NeedFakeDataSource"
import { NeedRepositoryImpl } from "@/data/repositories/NeedRepositoryImpl"
import { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { CreateNeedScreen } from "@/presentation/screens/needs/CreateNeedScreen"

const needFakeDataSource = new NeedFakeDataSource()
const needRepository = new NeedRepositoryImpl(needFakeDataSource)
const needManagementUseCase = new NeedManagementUseCase(needRepository)

export default function CreateNeedPage() {
  return (
    <CreateNeedScreen
      authUseCase={dashboardAuthUseCase}
      needManagementUseCase={needManagementUseCase}
    />
  )
}
