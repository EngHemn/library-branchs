"use client"

import { getReportsUseCase } from "@/app/dashboard/reports/reportsDependencies"
import { ReportsScreen } from "@/presentation/screens/reports/ReportsScreen"

export default function ReportsPage() {
  return <ReportsScreen getReportsUseCase={getReportsUseCase} />
}
