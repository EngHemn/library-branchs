import type { Bill } from "@/domain/entities/bill/Bill"

export type BillProduct = {
  bookId: string
  title: string
  isbn: string
}

export type BillDetail = Bill & {
  bookIds: string[]
  products: BillProduct[]
}
