import type { Book } from "@/domain/entities/book/Book"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type { Result } from "@/domain/result/Result"

export type CreateBookInput = {
  title: string
  language: string
  category: string
  author: string
  translator: string
  isbn: string
  description: string
  pages: number
  publicationDate: string
  shelfHint: string
  price: number
  stock: number
  branchId: string
}

export type UpdateBookInput = CreateBookInput & {
  id: string
}

export interface BookManagementRepository {
  getBooks(): Promise<Result<Book[]>>
  getBookById(bookId: string): Promise<Result<BookDetail | null>>
  getAuthorNames(): Promise<Result<string[]>>
  getTranslatorNames(): Promise<Result<string[]>>
  createBook(input: CreateBookInput): Promise<Result<Book>>
  updateBook(input: UpdateBookInput): Promise<Result<Book>>
  deleteBook(bookId: string): Promise<Result<null>>
}
