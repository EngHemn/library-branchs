import type {
  LowStockAlert,
  LowStockAlertSummary,
} from "@/domain/entities/alert/LowStockAlert"
import type { Result } from "@/domain/result/Result"

export interface LowStockAlertRepository {
  getAlerts(): Promise<Result<LowStockAlert[]>>
  getSummary(): Promise<Result<LowStockAlertSummary>>
  markResolved(alertId: string): Promise<Result<LowStockAlert>>
  restock(alertId: string, quantity: number): Promise<Result<LowStockAlert>>
  syncFromInventory(): Promise<Result<LowStockAlert[]>>
}
