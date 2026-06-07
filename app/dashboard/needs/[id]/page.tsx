"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { NeedFakeDataSource } from "@/data/datasources/NeedFakeDataSource"
import { NeedRepositoryImpl } from "@/data/repositories/NeedRepositoryImpl"
import { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { ViewNeedScreen } from "@/presentation/screens/needs/ViewNeedScreen"

const needFakeDataSource = new NeedFakeDataSource()
const needRepository = new NeedRepositoryImpl(needFakeDataSource)
const needManagementUseCase = new NeedManagementUseCase(needRepository)

type ViewNeedPageProps = {
  params: Promise<{ id: string }>
}

export default function ViewNeedPage({ params }: ViewNeedPageProps) {
  const { id } = use(params)

  return (
    <ViewNeedScreen
      needId={id}
      authUseCase={dashboardAuthUseCase}
      needManagementUseCase={needManagementUseCase}
    />
  )
}
