export type BookStatus = "available" | "borrowed" | "reserved" | "unavailable"

export type Book = {
  id: string
  title: string
  coverUrl: string | null
  category: string
  author: string
  translator: string | null
  isbn: string
  stock: number
  available: number
  status: BookStatus
  branchId: string
}
