import type {
  ReportsBundle,
  ReportsQuery,
} from "@/domain/entities/reports/Reports"
import type { Result } from "@/domain/result/Result"

export type ReportsRepository = {
  getReports(query: ReportsQuery): Promise<Result<ReportsBundle>>
}
