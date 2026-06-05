export type EventBranchBook = {
  id: string
  bookId: string
  title: string
  isbn: string
  language: string
  category: string
  author: string
  translator: string | null
  quantityAllocated: number
  quantityOnDisplay: number
}
