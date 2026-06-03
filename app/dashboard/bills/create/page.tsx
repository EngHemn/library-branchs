"use client"

import { BillManagementFakeDataSource } from "@/data/datasources/BillManagementFakeDataSource"
import { BillManagementRepositoryImpl } from "@/data/repositories/BillManagementRepositoryImpl"
import { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { CreateBillScreen } from "@/presentation/screens/bills/CreateBillScreen"

const billManagementFakeDataSource = new BillManagementFakeDataSource()
const billManagementRepository = new BillManagementRepositoryImpl(
  billManagementFakeDataSource
)
const getBillsUseCase = new GetBillsUseCase(billManagementRepository)

export default function Page() {
  return <CreateBillScreen getBillsUseCase={getBillsUseCase} />
}
