"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { ShelvesScreen } from "@/presentation/screens/shelves/ShelvesScreen"

export default function ShelvesPage() {
  return (
    <ShelvesScreen
      authUseCase={dashboardAuthUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
    />
  )
}
