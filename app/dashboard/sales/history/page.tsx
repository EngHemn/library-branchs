"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { salesUseCase } from "@/app/dashboard/sales/salesDependencies"
import { SalesHistoryScreen } from "@/presentation/screens/sales/SalesHistoryScreen"

export default function Page() {
  return (
    <SalesHistoryScreen
      authUseCase={dashboardAuthUseCase}
      salesUseCase={salesUseCase}
    />
  )
}
