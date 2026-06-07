"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { CreateShelfScreen } from "@/presentation/screens/shelves/CreateShelfScreen"

export default function CreateShelfPage() {
  return (
    <CreateShelfScreen
      authUseCase={dashboardAuthUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
    />
  )
}
