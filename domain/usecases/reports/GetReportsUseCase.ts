import type { ReportsBundle, ReportsQuery } from "@/domain/entities/reports/Reports"
import type { ReportsRepository } from "@/domain/repositories/ReportsRepository"
import type { Result } from "@/domain/result/Result"

export class GetReportsUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  getReports(query: ReportsQuery): Promise<Result<ReportsBundle>> {
    return this.reportsRepository.getReports(query)
  }
}
