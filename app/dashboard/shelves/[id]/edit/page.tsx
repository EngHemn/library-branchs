"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { EditShelfScreen } from "@/presentation/screens/shelves/EditShelfScreen"

type EditShelfPageProps = {
  params: Promise<{ id: string }>
}

export default function EditShelfPage({ params }: EditShelfPageProps) {
  const { id } = use(params)

  return (
    <EditShelfScreen
      shelfId={id}
      authUseCase={dashboardAuthUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
    />
  )
}
