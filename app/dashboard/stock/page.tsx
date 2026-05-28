"use client"

import { useStockViewModel } from "@/presentation/viewmodels/stock/useStockViewModel"
import { StockManagementScreen } from "@/presentation/screens/stock/StockManagementScreen"
import { stockUseCase } from "./stockDependencies"

export default function StockPage() {
  const viewModel = useStockViewModel(stockUseCase)
  return <StockManagementScreen viewModel={viewModel} />
}
