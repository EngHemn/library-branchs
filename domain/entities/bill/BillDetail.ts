import type { Bill } from "@/domain/entities/bill/Bill"

export type BillProduct = {
  bookId: string
  title: string
  isbn: string
  quantity: number
  initialPrice: number
  newPrice: number | null
  finalPrice: number
}

export type BillDetail = Bill & {
  bookIds: string[]
  products: BillProduct[]
}
