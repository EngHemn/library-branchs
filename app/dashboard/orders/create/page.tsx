"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { OrderManagementFakeDataSource } from "@/data/datasources/OrderManagementFakeDataSource"
import { OrderManagementRepositoryImpl } from "@/data/repositories/OrderManagementRepositoryImpl"
import { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { CreateOrderScreen } from "@/presentation/screens/orders/CreateOrderScreen"

const orderManagementFakeDataSource = new OrderManagementFakeDataSource()
const orderManagementRepository = new OrderManagementRepositoryImpl(
  orderManagementFakeDataSource
)
const getOrdersUseCase = new GetOrdersUseCase(orderManagementRepository)

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
      <CreateOrderScreen
        authUseCase={dashboardAuthUseCase}
        getOrdersUseCase={getOrdersUseCase}
      />
    </Suspense>
  )
}
