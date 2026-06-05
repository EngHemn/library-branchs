import type { CartItem } from "./CartItem"

export type Sale = {
  id: string
  branchId: string
  branchName: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  createdAt: string
}
