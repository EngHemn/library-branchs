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
  minAlert?: number
  status: BookStatus
  initialPrice?: number
  price: number
  branchId: string
  firstAddedBranch: string
  branchCount: number
  shelfHint: string
}
