import type { OrderStatus } from "./OrderStatus"

export type Order = {
  id: string
  branchId: string
  branchName: string
  branchLocation: string
  supplierName: string
  orderDate: string
  expectedDeliveryDate: string
  status: OrderStatus
  totalAmount: number
  itemCount: number
  phoneNumber: string
  notes?: string | null
  bookIds: string[]
  latitude: number | null
  longitude: number | null
}
