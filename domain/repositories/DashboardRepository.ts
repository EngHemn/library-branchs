import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { Result } from "@/domain/result/Result"

export interface DashboardRepository {
  getSummary(): Promise<Result<DashboardSummary>>
}
