"use client"

import { CreateStockScreen } from "@/presentation/screens/stock/CreateStockScreen"
import { stockUseCase } from "../stockDependencies"

export default function CreateStockPage() {
  return <CreateStockScreen stockUseCase={stockUseCase} />
}
