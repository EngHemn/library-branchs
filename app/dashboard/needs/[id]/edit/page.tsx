"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { NeedFakeDataSource } from "@/data/datasources/NeedFakeDataSource"
import { NeedRepositoryImpl } from "@/data/repositories/NeedRepositoryImpl"
import { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { EditNeedScreen } from "@/presentation/screens/needs/EditNeedScreen"

const needFakeDataSource = new NeedFakeDataSource()
const needRepository = new NeedRepositoryImpl(needFakeDataSource)
const needManagementUseCase = new NeedManagementUseCase(needRepository)

type EditNeedPageProps = {
  params: Promise<{ id: string }>
}

export default function EditNeedPage({ params }: EditNeedPageProps) {
  const { id } = use(params)

  return (
    <EditNeedScreen
      needId={id}
      authUseCase={dashboardAuthUseCase}
      needManagementUseCase={needManagementUseCase}
    />
  )
}
