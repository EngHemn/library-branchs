"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { LowStockAlertFakeDataSource } from "@/data/datasources/LowStockAlertFakeDataSource"
import { LowStockAlertRepositoryImpl } from "@/data/repositories/LowStockAlertRepositoryImpl"
import { LowStockAlertUseCase } from "@/domain/usecases/alerts/LowStockAlertUseCase"
import { LowStockAlertsScreen } from "@/presentation/screens/alerts/LowStockAlertsScreen"

const lowStockAlertFakeDataSource = new LowStockAlertFakeDataSource()
const lowStockAlertRepository = new LowStockAlertRepositoryImpl(
  lowStockAlertFakeDataSource
)
const lowStockAlertUseCase = new LowStockAlertUseCase(lowStockAlertRepository)

export default function LowStockAlertsPage() {
  return (
    <LowStockAlertsScreen
      authUseCase={dashboardAuthUseCase}
      lowStockAlertUseCase={lowStockAlertUseCase}
    />
  )
}
