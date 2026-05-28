"use client"

import { SalesScreen } from "@/presentation/screens/sales/SalesScreen"
import { salesUseCase } from "@/app/dashboard/sales/salesDependencies"

export default function Page() {
  return <SalesScreen salesUseCase={salesUseCase} />
}
