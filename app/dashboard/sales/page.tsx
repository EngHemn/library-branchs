"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { SalesScreen } from "@/presentation/screens/sales/SalesScreen"
import { salesUseCase } from "@/app/dashboard/sales/salesDependencies"

export default function Page() {
  return (
    <SalesScreen
      authUseCase={dashboardAuthUseCase}
      salesUseCase={salesUseCase}
    />
  )
}
