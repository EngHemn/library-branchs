import type { ShelfLocationPart } from "@/domain/entities/shelf/ShelfLocationOptions"

export type ShelfBook = {
  id: string
  shelfId: string
  bookId: string
  title: string
  author: string
  isbn: string
  category: string
  language: string
  locationParts: ShelfLocationPart[]
  quantity: number
}
