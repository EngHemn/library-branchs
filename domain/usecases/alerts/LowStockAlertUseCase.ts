import type {
  LowStockAlert,
  LowStockAlertSummary,
} from "@/domain/entities/alert/LowStockAlert"
import type { LowStockAlertRepository } from "@/domain/repositories/LowStockAlertRepository"
import type { Result } from "@/domain/result/Result"

export class LowStockAlertUseCase {
  constructor(
    private readonly lowStockAlertRepository: LowStockAlertRepository
  ) {}

  getAlerts(): Promise<Result<LowStockAlert[]>> {
    return this.lowStockAlertRepository.getAlerts()
  }

  getSummary(): Promise<Result<LowStockAlertSummary>> {
    return this.lowStockAlertRepository.getSummary()
  }

  markResolved(alertId: string): Promise<Result<LowStockAlert>> {
    return this.lowStockAlertRepository.markResolved(alertId)
  }

  restock(alertId: string, quantity: number): Promise<Result<LowStockAlert>> {
    return this.lowStockAlertRepository.restock(alertId, quantity)
  }

  syncFromInventory(): Promise<Result<LowStockAlert[]>> {
    return this.lowStockAlertRepository.syncFromInventory()
  }
}
