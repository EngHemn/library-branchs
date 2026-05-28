export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export type StockRow = {
  id: string
  bookId: string
  bookTitle: string
  bookCoverUrl: string | null
  isbn: string
  category: string
  branchId: string
  branchName: string
  subBranchId: string | null
  subBranchName: string | null
  currentStock: number
  reservedStock: number
  availableStock: number
  minStock: number
  status: StockStatus
  updatedAt: string
}

export type StockSummary = {
  totalAvailable: number
  totalReserved: number
  totalBorrowed: number
  totalSold: number
  totalEventStock: number
  totalDamaged: number
  totalLost: number
  lowStockItems: number
}

export type AddStockInput = {
  stockId: string
  quantity: number
  notes: string
}

export type ReduceStockInput = {
  stockId: string
  quantity: number
  notes: string
}

export type TransferStockInput = {
  bookId: string
  fromBranchId: string
  toBranchId: string
  quantity: number
  notes: string
}

export type CreateStockInput = {
  bookId: string
  branchId: string
  subBranchId: string | null
  initialStock: number
  minStock: number
}

export type UpdateStockInput = {
  stockId: string
  quantity: number
  minStock: number
  notes: string
}
