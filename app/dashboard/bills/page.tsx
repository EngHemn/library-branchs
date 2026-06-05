"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { BillManagementFakeDataSource } from "@/data/datasources/BillManagementFakeDataSource"
import { BillManagementRepositoryImpl } from "@/data/repositories/BillManagementRepositoryImpl"
import { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { BillsScreen } from "@/presentation/screens/bills/BillsScreen"

const billManagementFakeDataSource = new BillManagementFakeDataSource()
const billManagementRepository = new BillManagementRepositoryImpl(
  billManagementFakeDataSource
)
const getBillsUseCase = new GetBillsUseCase(billManagementRepository)

export default function Page() {
  return (
    <BillsScreen
      authUseCase={dashboardAuthUseCase}
      getBillsUseCase={getBillsUseCase}
    />
  )
}
