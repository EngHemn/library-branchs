"use client"

import { salesUseCase } from "@/app/dashboard/sales/salesDependencies"
import { SalesHistoryScreen } from "@/presentation/screens/sales/SalesHistoryScreen"

export default function Page() {
  return <SalesHistoryScreen salesUseCase={salesUseCase} />
}
