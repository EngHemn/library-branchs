export type BookStatus = "available" | "borrowed" | "reserved" | "unavailable"

export type Book = {
  id: string
  title: string
  coverUrl: string | null
  language: string
  category: string
  author: string
  translator: string | null
  isbn: string
  stock: number
  available: number
  status: BookStatus
  price: number
  branchId: string
  firstAddedBranch: string
  branchCount: number
}
