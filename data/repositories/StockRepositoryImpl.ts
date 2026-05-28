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
import type { StockFakeDataSource } from "@/data/datasources/StockFakeDataSource"

export class StockRepositoryImpl implements StockRepository {
  constructor(private readonly dataSource: StockFakeDataSource) {}

  getStockRows(): Promise<Result<StockRow[]>> {
    return this.dataSource.getStockRows()
  }

  getStockSummary(): Promise<Result<StockSummary>> {
    return this.dataSource.getStockSummary()
  }

  getStockMovements(): Promise<Result<StockMovement[]>> {
    return this.dataSource.getStockMovements()
  }

  createStock(input: CreateStockInput): Promise<Result<StockRow>> {
    return this.dataSource.createStock(input)
  }

  updateStock(input: UpdateStockInput): Promise<Result<StockRow>> {
    return this.dataSource.updateStock(input)
  }

  addStock(input: AddStockInput): Promise<Result<StockRow>> {
    return this.dataSource.addStock(input)
  }

  reduceStock(input: ReduceStockInput): Promise<Result<StockRow>> {
    return this.dataSource.reduceStock(input)
  }

  transferStock(input: TransferStockInput): Promise<Result<StockMovement>> {
    return this.dataSource.transferStock(input)
  }
}
