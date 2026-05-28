export type SaleBook = {
  id: string
  title: string
  coverUrl: string | null
  author: string
  translator?: string | null
  category: string
  language: string
  price: number
  discount: number
  stock: number
  branchId: string
}
