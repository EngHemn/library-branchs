"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
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
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      }
    >
      <CreateBillScreen
        authUseCase={dashboardAuthUseCase}
        getBillsUseCase={getBillsUseCase}
      />
    </Suspense>
  )
}
