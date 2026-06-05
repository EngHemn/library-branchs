"use client"

import { use } from "react"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { BillManagementFakeDataSource } from "@/data/datasources/BillManagementFakeDataSource"
import { BillManagementRepositoryImpl } from "@/data/repositories/BillManagementRepositoryImpl"
import { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { EditBillScreen } from "@/presentation/screens/bills/EditBillScreen"

const billManagementFakeDataSource = new BillManagementFakeDataSource()
const billManagementRepository = new BillManagementRepositoryImpl(
  billManagementFakeDataSource
)
const getBillsUseCase = new GetBillsUseCase(billManagementRepository)

type PageProps = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: PageProps) {
  const { id } = use(params)
  return (
    <EditBillScreen
      billId={id}
      authUseCase={dashboardAuthUseCase}
      getBillsUseCase={getBillsUseCase}
    />
  )
}
