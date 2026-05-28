import type { CartItem } from "../../entities/sales/CartItem"
import type { SalesRepository } from "../../repositories/SalesRepository"

export class SalesUseCase {
  constructor(private readonly salesRepository: SalesRepository) {}

  getBranches() {
    return this.salesRepository.getBranches()
  }

  getAllBooks() {
    return this.salesRepository.getAllBooks()
  }

  getBooksByBranch(branchId: string) {
    return this.salesRepository.getBooksByBranch(branchId)
  }

  placeSale(branchId: string, items: CartItem[]) {
    return this.salesRepository.placeSale(branchId, items)
  }

  getSalesHistory() {
    return this.salesRepository.getSalesHistory()
  }
}
