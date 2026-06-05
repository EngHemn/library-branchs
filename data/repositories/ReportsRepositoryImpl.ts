import type { ReportsFakeDataSource } from "@/data/datasources/ReportsFakeDataSource"
import type { ReportsBundle, ReportsQuery } from "@/domain/entities/reports/Reports"
import type { ReportsRepository } from "@/domain/repositories/ReportsRepository"
import type { Result } from "@/domain/result/Result"

export class ReportsRepositoryImpl implements ReportsRepository {
  constructor(private readonly dataSource: ReportsFakeDataSource) {}

  getReports(query: ReportsQuery): Promise<Result<ReportsBundle>> {
    return this.dataSource.getReports(query)
  }
}
