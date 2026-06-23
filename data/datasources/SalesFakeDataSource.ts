import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeSaleBooks } from "@/data/fake/fakeSaleBooks"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const INITIAL_SALES_COUNT = 123

function generateInitialSalesHistory(): Sale[] {
  const baseDate = new Date("2026-01-01T08:00:00.000Z")
  const history: Sale[] = []

  for (let index = 0; index < INITIAL_SALES_COUNT; index += 1) {
    const branch = fakeBranches[index % fakeBranches.length]
    const branchBooks = fakeSaleBooks.filter(
      (book) => book.branchId === branch.id
    )
    const firstBook = branchBooks[index % branchBooks.length]
    const secondBook = branchBooks[(index + 1) % branchBooks.length]

    const firstQuantity = (index % 3) + 1
    const secondQuantity = ((index + 1) % 2) + 1

    const items: CartItem[] = [
      { book: { ...firstBook }, quantity: firstQuantity },
      { book: { ...secondBook }, quantity: secondQuantity },
    ]

    const subtotal = items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    )
    const discountAmount = items.reduce(
      (sum, item) =>
        sum + ((item.book.price * item.book.discount) / 100) * item.quantity,
      0
    )

    const createdAt = new Date(baseDate)
    createdAt.setDate(baseDate.getDate() + index)
    createdAt.setHours(9 + (index % 9), (index * 7) % 60, 0, 0)

    history.unshift({
      id: `SALE-${String(index + 1).padStart(4, "0")}`,
      branchId: branch.id,
      branchName: branch.branchName,
      items,
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
      status: index % 11 === 0 ? "voided" : "completed",
      createdAt: createdAt.toISOString(),
    })
  }

  return history
}

let saleIdCounter = INITIAL_SALES_COUNT + 1
const salesHistory: Sale[] = generateInitialSalesHistory()

export class SalesFakeDataSource {
  async getBranches(): Promise<Result<Branch[]>> {
    await delay(300)
    return {
      success: true,
      data: fakeBranches.map((b) => ({ ...b })),
    }
  }

  async getBooksByBranch(branchId: string): Promise<Result<SaleBook[]>> {
    await delay(400)
    const books = fakeSaleBooks.filter((b) => b.branchId === branchId)
    return {
      success: true,
      data: books.map((b) => ({ ...b })),
    }
  }

  async getAllBooks(): Promise<Result<SaleBook[]>> {
    await delay(450)
    return {
      success: true,
      data: fakeSaleBooks.map((b) => ({ ...b })),
    }
  }

  async placeSale(branchId: string, items: CartItem[]): Promise<Result<Sale>> {
    await delay(700)

    const branch = fakeBranches.find((b) => b.id === branchId)
    if (!branch) {
      return { success: false, error: "Branch not found." }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    )
    const discountAmount = items.reduce(
      (sum, item) =>
        sum + ((item.book.price * item.book.discount) / 100) * item.quantity,
      0
    )

    const sale: Sale = {
      id: `SALE-${String(saleIdCounter++).padStart(4, "0")}`,
      branchId,
      branchName: branch.branchName,
      items: items.map((item) => ({ ...item })),
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    salesHistory.unshift({ ...sale, items: items.map((item) => ({ ...item })) })

    return { success: true, data: sale }
  }

  async getSalesHistory(): Promise<Result<Sale[]>> {
    await delay(300)
    return {
      success: true,
      data: salesHistory.map((sale) => ({
        ...sale,
        items: sale.items.map((item) => ({ ...item })),
      })),
    }
  }
}
