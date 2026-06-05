import type { CartItem } from "./CartItem"
import type { SaleStatus } from "./SaleStatus"

export type Sale = {
  id: string
  branchId: string
  branchName: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  status: SaleStatus
  createdAt: string
}
