export type LowStockAlertStatus = "active" | "resolved"

export type LowStockAlert = {
  id: string
  stockId: string
  bookId: string
  bookTitle: string
  bookCoverUrl: string | null
  isbn: string
  branchId: string
  branchName: string
  currentStock: number
  minimumStock: number
  shortageQuantity: number
  status: LowStockAlertStatus
  createdAt: string
  resolvedAt: string | null
}

export type LowStockAlertSummary = {
  lowStockBooks: number
  outOfStockBooks: number
  activeAlerts: number
}
