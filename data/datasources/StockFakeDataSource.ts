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
import type { Result } from "@/domain/result/Result"
import { fakeStockMovements } from "@/data/fake/fakeStockMovements"
import { fakeStockRows, fakeStockSummary } from "@/data/fake/fakeStock"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function computeStatus(
  available: number,
  minStock: number
): "in_stock" | "low_stock" | "out_of_stock" {
  if (available === 0) return "out_of_stock"
  if (available <= minStock) return "low_stock"
  return "in_stock"
}

export class StockFakeDataSource {
  private stockRows: StockRow[] = fakeStockRows.map((row) => ({ ...row }))
  private movements: StockMovement[] = fakeStockMovements.map((m) => ({ ...m }))

  async getStockRows(): Promise<Result<StockRow[]>> {
    await delay(600)
    return { success: true, data: this.stockRows.map((row) => ({ ...row })) }
  }

  async getStockSummary(): Promise<Result<StockSummary>> {
    await delay(400)
    return { success: true, data: { ...fakeStockSummary } }
  }

  async getStockMovements(): Promise<Result<StockMovement[]>> {
    await delay(700)
    return {
      success: true,
      data: [...this.movements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }
  }

  async createStock(input: CreateStockInput): Promise<Result<StockRow>> {
    await delay(500)

    const matchedBook = this.stockRows.find((row) => row.bookId === input.bookId)
    if (!matchedBook) {
      return { success: false, error: "Book not found for stock creation." }
    }

    const branchRow = this.stockRows.find(
      (row) => row.branchId === input.branchId && row.subBranchId === null
    )
    if (!branchRow) {
      return { success: false, error: "Selected branch was not found." }
    }

    const existing = this.stockRows.find(
      (row) =>
        row.bookId === input.bookId &&
        row.branchId === input.branchId &&
        row.subBranchId === input.subBranchId
    )
    if (existing) {
      return {
        success: false,
        error: "A stock record already exists for this book and branch.",
      }
    }

    const nextId = `STK-${String(this.stockRows.length + 1).padStart(3, "0")}`
    const subBranch = input.subBranchId
      ? this.stockRows.find((row) => row.subBranchId === input.subBranchId)
      : null

    const availableStock = Math.max(0, input.initialStock)
    const created: StockRow = {
      id: nextId,
      bookId: matchedBook.bookId,
      bookTitle: matchedBook.bookTitle,
      bookCoverUrl: matchedBook.bookCoverUrl,
      isbn: matchedBook.isbn,
      category: matchedBook.category,
      branchId: input.branchId,
      branchName: branchRow.branchName,
      subBranchId: input.subBranchId,
      subBranchName: subBranch?.subBranchName ?? null,
      currentStock: availableStock,
      reservedStock: 0,
      availableStock,
      minStock: input.minStock,
      status: computeStatus(availableStock, input.minStock),
      updatedAt: new Date().toISOString(),
    }

    this.stockRows.unshift(created)
    return { success: true, data: { ...created } }
  }

  async updateStock(input: UpdateStockInput): Promise<Result<StockRow>> {
    await delay(500)
    const index = this.stockRows.findIndex((row) => row.id === input.stockId)
    if (index === -1) {
      return { success: false, error: "Stock record not found" }
    }

    const row = this.stockRows[index]
    if (input.quantity < row.reservedStock) {
      return {
        success: false,
        error: `Quantity cannot be lower than reserved stock (${row.reservedStock}).`,
      }
    }

    const newAvailable = input.quantity - row.reservedStock
    const updated: StockRow = {
      ...row,
      currentStock: input.quantity,
      availableStock: newAvailable,
      minStock: input.minStock,
      status: computeStatus(newAvailable, input.minStock),
      updatedAt: new Date().toISOString(),
    }
    this.stockRows[index] = updated

    if (input.notes.trim().length > 0) {
      const movId = `MOV-${String(this.movements.length + 1).padStart(3, "0")}`
      this.movements.unshift({
        id: movId,
        movementType: "manual_adjustment",
        bookId: row.bookId,
        bookTitle: row.bookTitle,
        fromBranchId: row.branchId,
        fromBranchName: row.branchName,
        toBranchId: row.branchId,
        toBranchName: row.branchName,
        quantity: Math.abs(input.quantity - row.currentStock),
        previousStock: row.currentStock,
        newStock: input.quantity,
        userId: "USR-001",
        userName: "Maya Collins",
        createdAt: new Date().toISOString(),
        notes: input.notes,
      })
    }

    return { success: true, data: { ...updated } }
  }

  async addStock(input: AddStockInput): Promise<Result<StockRow>> {
    await delay(500)
    const index = this.stockRows.findIndex((r) => r.id === input.stockId)
    if (index === -1) {
      return { success: false, error: "Stock record not found" }
    }

    const row = this.stockRows[index]
    const newCurrent = row.currentStock + input.quantity
    const newAvailable = row.availableStock + input.quantity
    const updated: StockRow = {
      ...row,
      currentStock: newCurrent,
      availableStock: newAvailable,
      status: computeStatus(newAvailable, row.minStock),
      updatedAt: new Date().toISOString(),
    }
    this.stockRows[index] = updated

    const movId = `MOV-${String(this.movements.length + 1).padStart(3, "0")}`
    this.movements.unshift({
      id: movId,
      movementType: "stock_added",
      bookId: row.bookId,
      bookTitle: row.bookTitle,
      fromBranchId: null,
      fromBranchName: null,
      toBranchId: row.branchId,
      toBranchName: row.branchName,
      quantity: input.quantity,
      previousStock: row.currentStock,
      newStock: newCurrent,
      userId: "USR-001",
      userName: "Maya Collins",
      createdAt: new Date().toISOString(),
      notes: input.notes || null,
    })

    return { success: true, data: { ...updated } }
  }

  async reduceStock(input: ReduceStockInput): Promise<Result<StockRow>> {
    await delay(500)
    const index = this.stockRows.findIndex((r) => r.id === input.stockId)
    if (index === -1) {
      return { success: false, error: "Stock record not found" }
    }

    const row = this.stockRows[index]
    if (input.quantity > row.availableStock) {
      return {
        success: false,
        error: `Cannot reduce by ${input.quantity}. Only ${row.availableStock} available.`,
      }
    }

    const newCurrent = row.currentStock - input.quantity
    const newAvailable = row.availableStock - input.quantity
    const updated: StockRow = {
      ...row,
      currentStock: newCurrent,
      availableStock: newAvailable,
      status: computeStatus(newAvailable, row.minStock),
      updatedAt: new Date().toISOString(),
    }
    this.stockRows[index] = updated

    const movId = `MOV-${String(this.movements.length + 1).padStart(3, "0")}`
    this.movements.unshift({
      id: movId,
      movementType: "stock_reduced",
      bookId: row.bookId,
      bookTitle: row.bookTitle,
      fromBranchId: row.branchId,
      fromBranchName: row.branchName,
      toBranchId: null,
      toBranchName: null,
      quantity: input.quantity,
      previousStock: row.currentStock,
      newStock: newCurrent,
      userId: "USR-001",
      userName: "Maya Collins",
      createdAt: new Date().toISOString(),
      notes: input.notes || null,
    })

    return { success: true, data: { ...updated } }
  }

  async transferStock(input: TransferStockInput): Promise<Result<StockMovement>> {
    await delay(700)

    const fromRow = this.stockRows.find(
      (r) =>
        r.bookId === input.bookId &&
        r.branchId === input.fromBranchId &&
        r.subBranchId === null
    )

    if (!fromRow) {
      return {
        success: false,
        error: "Source stock record not found",
      }
    }

    if (input.quantity > fromRow.availableStock) {
      return {
        success: false,
        error: `Cannot transfer ${input.quantity}. Only ${fromRow.availableStock} available.`,
      }
    }

    const fromIndex = this.stockRows.findIndex((r) => r.id === fromRow.id)
    const newFromCurrent = fromRow.currentStock - input.quantity
    const newFromAvailable = fromRow.availableStock - input.quantity
    this.stockRows[fromIndex] = {
      ...fromRow,
      currentStock: newFromCurrent,
      availableStock: newFromAvailable,
      status: computeStatus(newFromAvailable, fromRow.minStock),
      updatedAt: new Date().toISOString(),
    }

    const toIndex = this.stockRows.findIndex(
      (r) =>
        r.bookId === input.bookId &&
        r.branchId === input.toBranchId &&
        r.subBranchId === null
    )

    if (toIndex !== -1) {
      const toRow = this.stockRows[toIndex]
      const newToCurrent = toRow.currentStock + input.quantity
      const newToAvailable = toRow.availableStock + input.quantity
      this.stockRows[toIndex] = {
        ...toRow,
        currentStock: newToCurrent,
        availableStock: newToAvailable,
        status: computeStatus(newToAvailable, toRow.minStock),
        updatedAt: new Date().toISOString(),
      }
    }

    const movId = `MOV-${String(this.movements.length + 1).padStart(3, "0")}`
    const movement: StockMovement = {
      id: movId,
      movementType: "transfer",
      bookId: input.bookId,
      bookTitle: fromRow.bookTitle,
      fromBranchId: input.fromBranchId,
      fromBranchName: fromRow.branchName,
      toBranchId: input.toBranchId,
      toBranchName:
        this.stockRows.find(
          (r) => r.branchId === input.toBranchId && r.subBranchId === null
        )?.branchName ?? input.toBranchId,
      quantity: input.quantity,
      previousStock: fromRow.currentStock,
      newStock: newFromCurrent,
      userId: "USR-001",
      userName: "Maya Collins",
      createdAt: new Date().toISOString(),
      notes: input.notes || null,
    }
    this.movements.unshift(movement)

    return { success: true, data: { ...movement } }
  }
}
