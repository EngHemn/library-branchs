import type { Order } from "@/domain/entities/order/Order"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import type { Result } from "@/domain/result/Result"

export type OrderBranchOption = {
  id: string
  name: string
  address: string
  latitude: number | null
  longitude: number | null
}

export type OrderBookOption = {
  id: string
  title: string
  isbn: string
  author: string
  translator: string | null
  category: string
  price: number
}

export type OrderFormOptions = {
  branches: OrderBranchOption[]
  books: OrderBookOption[]
}

export type CreateOrderInput = {
  branchId: string
  supplierName: string
  orderDate: string
  expectedDeliveryDate: string
  status: Order["status"]
  phoneNumber: string
  supplierEmail?: string | null
  totalAmount: number
  notes?: string | null
  bookIds: string[]
  items?: {
    bookId: string
    quantity: number
    unitPrice: number
  }[]
  latitude?: number | null
  longitude?: number | null
}

export type UpdateOrderInput = CreateOrderInput & {
  id: string
}

export interface OrderManagementRepository {
  getOrders(): Promise<Result<Order[]>>
  getOrderById(orderId: string): Promise<Result<OrderDetail | null>>
  getOrderFormOptions(): Promise<Result<OrderFormOptions>>
  createOrder(input: CreateOrderInput): Promise<Result<Order>>
  updateOrder(input: UpdateOrderInput): Promise<Result<Order>>
  deleteOrder(orderId: string): Promise<Result<null>>
}
