import type { Order } from "./Order"

export type OrderItem = {
  bookId: string
  title: string
  isbn: string
  author: string
  translator: string | null
  category: string
  quantity: number
  unitPrice: number
}

export type OrderDetail = Order & {
  bookIds: string[]
  supplierEmail?: string | null
  items: OrderItem[]
}
