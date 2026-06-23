import { getFakeReports } from "@/data/fake/fakeReports"
import type {
  ReportsBundle,
  ReportsQuery,
} from "@/domain/entities/reports/Reports"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class ReportsFakeDataSource {
  async getReports(query: ReportsQuery): Promise<Result<ReportsBundle>> {
    await delay(400)

    return {
      success: true,
      data: getFakeReports(query),
    }
  }
}
