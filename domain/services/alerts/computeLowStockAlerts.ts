import type { StockRow } from "@/domain/entities/stock/Stock"
import type { LowStockAlert } from "@/domain/entities/alert/LowStockAlert"

export function buildLowStockAlertId(stockId: string): string {
  return `LSA-${stockId}`
}

export function computeLowStockAlertsFromStock(
  stockRows: StockRow[],
  manuallyResolvedIds: Set<string> = new Set()
): LowStockAlert[] {
  return stockRows
    .filter((row) => row.availableStock <= row.minStock)
    .map((row) => {
      const id = buildLowStockAlertId(row.id)
      const isManuallyResolved = manuallyResolvedIds.has(id)
      const autoResolved = row.availableStock > row.minStock

      return {
        id,
        stockId: row.id,
        bookId: row.bookId,
        bookTitle: row.bookTitle,
        bookCoverUrl: row.bookCoverUrl,
        isbn: row.isbn,
        branchId: row.branchId,
        branchName: row.branchName,
        currentStock: row.availableStock,
        minimumStock: row.minStock,
        shortageQuantity: Math.max(0, row.minStock - row.availableStock),
        status:
          isManuallyResolved || autoResolved
            ? ("resolved" as const)
            : ("active" as const),
        createdAt: row.updatedAt,
        resolvedAt: isManuallyResolved ? new Date().toISOString() : null,
      }
    })
    .filter((alert) => alert.status === "active" || manuallyResolvedIds.has(alert.id))
}

export function computeLowStockAlertSummary(
  alerts: LowStockAlert[]
): {
  lowStockBooks: number
  outOfStockBooks: number
  activeAlerts: number
} {
  const activeAlerts = alerts.filter((alert) => alert.status === "active")

  return {
    activeAlerts: activeAlerts.length,
    lowStockBooks: activeAlerts.filter((alert) => alert.currentStock > 0).length,
    outOfStockBooks: activeAlerts.filter((alert) => alert.currentStock === 0)
      .length,
  }
}
