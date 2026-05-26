import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { DashboardRepository } from "@/domain/repositories/DashboardRepository"
import type { Result } from "@/domain/result/Result"

export class GetDashboardSummaryUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  getSummary(): Promise<Result<DashboardSummary>> {
    return this.dashboardRepository.getSummary()
  }
}
