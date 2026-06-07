"use client"

import { use } from "react"

import { OrderManagementFakeDataSource } from "@/data/datasources/OrderManagementFakeDataSource"
import { OrderManagementRepositoryImpl } from "@/data/repositories/OrderManagementRepositoryImpl"
import { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { ViewOrderScreen } from "@/presentation/screens/orders/ViewOrderScreen"

const orderManagementFakeDataSource = new OrderManagementFakeDataSource()
const orderManagementRepository = new OrderManagementRepositoryImpl(
  orderManagementFakeDataSource
)
const getOrdersUseCase = new GetOrdersUseCase(orderManagementRepository)

type PageProps = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: PageProps) {
  const { id } = use(params)
  return <ViewOrderScreen orderId={id} getOrdersUseCase={getOrdersUseCase} />
}
