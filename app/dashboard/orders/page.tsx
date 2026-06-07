"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { OrderManagementFakeDataSource } from "@/data/datasources/OrderManagementFakeDataSource"
import { OrderManagementRepositoryImpl } from "@/data/repositories/OrderManagementRepositoryImpl"
import { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { OrdersScreen } from "@/presentation/screens/orders/OrdersScreen"

const orderManagementFakeDataSource = new OrderManagementFakeDataSource()
const orderManagementRepository = new OrderManagementRepositoryImpl(
  orderManagementFakeDataSource
)
const getOrdersUseCase = new GetOrdersUseCase(orderManagementRepository)

export default function Page() {
  return (
    <OrdersScreen
      authUseCase={dashboardAuthUseCase}
      getOrdersUseCase={getOrdersUseCase}
    />
  )
}
