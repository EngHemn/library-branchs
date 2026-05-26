"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { DashboardFakeDataSource } from "@/data/datasources/DashboardFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { DashboardRepositoryImpl } from "@/data/repositories/DashboardRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GetDashboardSummaryUseCase } from "@/domain/usecases/dashboard/GetDashboardSummaryUseCase"
import { DashboardScreen } from "@/presentation/screens/dashboard/DashboardScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const dashboardFakeDataSource = new DashboardFakeDataSource()
const dashboardRepository = new DashboardRepositoryImpl(dashboardFakeDataSource)
const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(
  dashboardRepository
)

export default function Page() {
  return (
    <DashboardScreen
      authUseCase={authUseCase}
      getDashboardSummaryUseCase={getDashboardSummaryUseCase}
    />
  )
}
