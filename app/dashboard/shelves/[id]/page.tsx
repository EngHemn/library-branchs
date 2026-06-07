"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { ViewShelfScreen } from "@/presentation/screens/shelves/ViewShelfScreen"

type ViewShelfPageProps = {
  params: Promise<{ id: string }>
}

export default function ViewShelfPage({ params }: ViewShelfPageProps) {
  const { id } = use(params)

  return (
    <ViewShelfScreen
      shelfId={id}
      authUseCase={dashboardAuthUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
    />
  )
}
