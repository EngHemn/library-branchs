"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { getReportsUseCase } from "@/app/dashboard/reports/reportsDependencies"
import { ReportsScreen } from "@/presentation/screens/reports/ReportsScreen"

export default function ReportsPage() {
  return (
    <ReportsScreen
      authUseCase={dashboardAuthUseCase}
      getReportsUseCase={getReportsUseCase}
    />
  )
}
