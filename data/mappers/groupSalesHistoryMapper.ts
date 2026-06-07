import type { GroupSalesHistoryRecord } from "@/domain/entities/group/GroupSalesHistory"
import type { Sale } from "@/domain/entities/sales/Sale"

export function groupSalesHistoryRecordToSale(
  record: GroupSalesHistoryRecord
): Sale {
  return {
    id: record.id,
    branchId: record.branchId,
    branchName: record.branchName,
    items: record.items.map((item) => ({
      book: { ...item.book },
      quantity: item.quantity,
    })),
    subtotal: record.subtotal,
    discountAmount: record.discountAmount,
    total: record.total,
    status: record.status,
    createdAt: record.createdAt,
  }
}

export function groupSalesHistoryRecordsToSales(
  records: GroupSalesHistoryRecord[]
): Sale[] {
  return records.map(groupSalesHistoryRecordToSale)
}
