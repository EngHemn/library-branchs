import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { SaleStatus } from "@/domain/entities/sales/SaleStatus"

export type GroupSalesHistoryRecord = {
  id: string
  groupId: string
  branchId: string
  branchName: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  status: SaleStatus
  createdAt: string
}
