import type { Branch } from "../entities/branch/Branch"
import type { CartItem } from "../entities/sales/CartItem"
import type { Sale } from "../entities/sales/Sale"
import type { SaleBook } from "../entities/sales/SaleBook"
import type { Result } from "../result/Result"

export interface SalesRepository {
  getBranches(): Promise<Result<Branch[]>>
  getAllBooks(): Promise<Result<SaleBook[]>>
  getBooksByBranch(branchId: string): Promise<Result<SaleBook[]>>
  placeSale(branchId: string, items: CartItem[]): Promise<Result<Sale>>
  getSalesHistory(): Promise<Result<Sale[]>>
}
