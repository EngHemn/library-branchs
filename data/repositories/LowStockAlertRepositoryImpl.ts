import type { LowStockAlertFakeDataSource } from "@/data/datasources/LowStockAlertFakeDataSource"
import type {
  LowStockAlert,
  LowStockAlertSummary,
} from "@/domain/entities/alert/LowStockAlert"
import type { LowStockAlertRepository } from "@/domain/repositories/LowStockAlertRepository"
import type { Result } from "@/domain/result/Result"

export class LowStockAlertRepositoryImpl implements LowStockAlertRepository {
  constructor(private readonly dataSource: LowStockAlertFakeDataSource) {}

  getAlerts(): Promise<Result<LowStockAlert[]>> {
    return this.dataSource.getAlerts()
  }

  getSummary(): Promise<Result<LowStockAlertSummary>> {
    return this.dataSource.getSummary()
  }

  markResolved(alertId: string): Promise<Result<LowStockAlert>> {
    return this.dataSource.markResolved(alertId)
  }

  restock(alertId: string, quantity: number): Promise<Result<LowStockAlert>> {
    return this.dataSource.restock(alertId, quantity)
  }

  syncFromInventory(): Promise<Result<LowStockAlert[]>> {
    return this.dataSource.syncFromInventory()
  }
}
