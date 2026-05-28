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
import type { StockRepository } from "@/domain/repositories/StockRepository"
import type { Result } from "@/domain/result/Result"

export class StockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  getStockRows(): Promise<Result<StockRow[]>> {
    return this.stockRepository.getStockRows()
  }

  getStockSummary(): Promise<Result<StockSummary>> {
    return this.stockRepository.getStockSummary()
  }

  getStockMovements(): Promise<Result<StockMovement[]>> {
    return this.stockRepository.getStockMovements()
  }

  createStock(input: CreateStockInput): Promise<Result<StockRow>> {
    return this.stockRepository.createStock(input)
  }

  updateStock(input: UpdateStockInput): Promise<Result<StockRow>> {
    return this.stockRepository.updateStock(input)
  }

  addStock(input: AddStockInput): Promise<Result<StockRow>> {
    return this.stockRepository.addStock(input)
  }

  reduceStock(input: ReduceStockInput): Promise<Result<StockRow>> {
    return this.stockRepository.reduceStock(input)
  }

  transferStock(input: TransferStockInput): Promise<Result<StockMovement>> {
    return this.stockRepository.transferStock(input)
  }
}
