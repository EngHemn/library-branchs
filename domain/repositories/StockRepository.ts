import type { Result } from "@/domain/result/Result"
import type {
  AddStockInput,
  CreateStockInput,
  ReduceStockInput,
  StockRow,
  StockSummary,
  TransferStockInput,
  UpdateStockInput,
} from "@/domain/entities/stock/Stock"
import type { StockMovement } from "@/domain/entities/stock/StockMovement"

export interface StockRepository {
  getStockRows(): Promise<Result<StockRow[]>>
  getStockSummary(): Promise<Result<StockSummary>>
  getStockMovements(): Promise<Result<StockMovement[]>>
  createStock(input: CreateStockInput): Promise<Result<StockRow>>
  updateStock(input: UpdateStockInput): Promise<Result<StockRow>>
  addStock(input: AddStockInput): Promise<Result<StockRow>>
  reduceStock(input: ReduceStockInput): Promise<Result<StockRow>>
  transferStock(input: TransferStockInput): Promise<Result<StockMovement>>
}
