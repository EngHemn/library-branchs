import type { SalesFakeDataSource } from "@/data/datasources/SalesFakeDataSource"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { SalesRepository } from "@/domain/repositories/SalesRepository"
import type { Result } from "@/domain/result/Result"

export class SalesRepositoryImpl implements SalesRepository {
  constructor(private readonly dataSource: SalesFakeDataSource) {}

  getBranches(): Promise<Result<Branch[]>> {
    return this.dataSource.getBranches()
  }

  getAllBooks(): Promise<Result<SaleBook[]>> {
    return this.dataSource.getAllBooks()
  }

  getBooksByBranch(branchId: string): Promise<Result<SaleBook[]>> {
    return this.dataSource.getBooksByBranch(branchId)
  }

  placeSale(branchId: string, items: CartItem[]): Promise<Result<Sale>> {
    return this.dataSource.placeSale(branchId, items)
  }

  getSalesHistory(): Promise<Result<Sale[]>> {
    return this.dataSource.getSalesHistory()
  }
}
