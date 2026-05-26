import { DashboardFakeDataSource } from "@/data/datasources/DashboardFakeDataSource"
import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { DashboardRepository } from "@/domain/repositories/DashboardRepository"
import type { Result } from "@/domain/result/Result"

export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private readonly dashboardFakeDataSource: DashboardFakeDataSource) {}

  getSummary(): Promise<Result<DashboardSummary>> {
    return this.dashboardFakeDataSource.getSummary()
  }
}
