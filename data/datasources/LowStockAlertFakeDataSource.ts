import { fakeStockRows } from "@/data/fake/fakeStock"
import { dispatchFakeNotification } from "@/data/fake/fakeNotifications"
import type {
  LowStockAlert,
  LowStockAlertSummary,
} from "@/domain/entities/alert/LowStockAlert"
import {
  buildLowStockAlertId,
  computeLowStockAlertSummary,
  computeLowStockAlertsFromStock,
} from "@/domain/services/alerts/computeLowStockAlerts"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class LowStockAlertFakeDataSource {
  private stockRows = fakeStockRows.map((row) => ({ ...row }))
  private manuallyResolvedIds = new Set<string>()
  private notifiedOutOfStock = new Set<string>()

  private computeAlerts(): LowStockAlert[] {
    const alerts = computeLowStockAlertsFromStock(
      this.stockRows,
      this.manuallyResolvedIds
    )

    return alerts.filter((alert) => {
      if (
        alert.status === "resolved" &&
        !this.manuallyResolvedIds.has(alert.id)
      ) {
        return false
      }
      return true
    })
  }

  private notifyForNewAlerts(alerts: LowStockAlert[]): void {
    for (const alert of alerts) {
      if (alert.status !== "active") continue

      if (alert.currentStock === 0 && !this.notifiedOutOfStock.has(alert.id)) {
        this.notifiedOutOfStock.add(alert.id)
        dispatchFakeNotification({
          title: "Book out of stock",
          message: `"${alert.bookTitle}" is out of stock at ${alert.branchName}.`,
          type: "warning",
        })
      } else if (
        alert.currentStock > 0 &&
        alert.currentStock <= alert.minimumStock
      ) {
        dispatchFakeNotification({
          title: "Low stock alert",
          message: `"${alert.bookTitle}" has ${alert.currentStock} copies left at ${alert.branchName}.`,
          type: "warning",
          sendEmail: true,
        })
      }
    }
  }

  async getAlerts(): Promise<Result<LowStockAlert[]>> {
    await delay(300)
    const alerts = this.computeAlerts()
    return { success: true, data: alerts }
  }

  async getSummary(): Promise<Result<LowStockAlertSummary>> {
    await delay(200)
    const alerts = this.computeAlerts().filter((a) => a.status === "active")
    return { success: true, data: computeLowStockAlertSummary(alerts) }
  }

  async markResolved(alertId: string): Promise<Result<LowStockAlert>> {
    await delay(250)
    const alerts = this.computeAlerts()
    const alert = alerts.find((item) => item.id === alertId)

    if (!alert) {
      return { success: false, error: `Alert ${alertId} not found` }
    }

    this.manuallyResolvedIds.add(alertId)

    const resolved: LowStockAlert = {
      ...alert,
      status: "resolved",
      resolvedAt: new Date().toISOString(),
    }

    return { success: true, data: resolved }
  }

  async restock(
    alertId: string,
    quantity: number
  ): Promise<Result<LowStockAlert>> {
    await delay(350)

    if (quantity <= 0) {
      return {
        success: false,
        error: "Restock quantity must be greater than zero.",
      }
    }

    const alerts = this.computeAlerts()
    const alert = alerts.find((item) => item.id === alertId)

    if (!alert) {
      return { success: false, error: `Alert ${alertId} not found` }
    }

    const stockIndex = this.stockRows.findIndex(
      (row) => row.id === alert.stockId
    )

    if (stockIndex === -1) {
      return { success: false, error: "Stock record not found." }
    }

    const row = this.stockRows[stockIndex]
    const newAvailable = row.availableStock + quantity
    const newCurrent = row.currentStock + quantity
    const newStatus =
      newAvailable === 0
        ? "out_of_stock"
        : newAvailable <= row.minStock
          ? "low_stock"
          : "in_stock"

    this.stockRows[stockIndex] = {
      ...row,
      currentStock: newCurrent,
      availableStock: newAvailable,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }

    this.manuallyResolvedIds.delete(alertId)
    this.notifiedOutOfStock.delete(alertId)

    const updatedAlerts = this.computeAlerts()
    const updated =
      updatedAlerts.find((item) => item.id === alertId) ??
      ({
        ...alert,
        currentStock: newAvailable,
        shortageQuantity: Math.max(0, alert.minimumStock - newAvailable),
        status: newAvailable > alert.minimumStock ? "resolved" : "active",
        resolvedAt:
          newAvailable > alert.minimumStock ? new Date().toISOString() : null,
      } as LowStockAlert)

    return { success: true, data: updated }
  }

  async syncFromInventory(): Promise<Result<LowStockAlert[]>> {
    await delay(400)
    const alerts = this.computeAlerts().filter((a) => a.status === "active")
    this.notifyForNewAlerts(alerts)
    return { success: true, data: alerts }
  }

  getAlertIdForStock(stockId: string): string {
    return buildLowStockAlertId(stockId)
  }
}
