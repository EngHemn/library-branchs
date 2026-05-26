import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { Result } from "@/domain/result/Result"
import { fakeDashboardSummary } from "@/data/fake/fakeDashboardSummary"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class DashboardFakeDataSource {
  async getSummary(): Promise<Result<DashboardSummary>> {
    await delay(400)

    return {
      success: true,
      data: fakeDashboardSummary,
    }
  }
}
