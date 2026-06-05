import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import type { Book } from "@/domain/entities/book/Book"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type {
  BookManagementRepository,
  CreateBookInput,
  UpdateBookInput,
} from "@/domain/repositories/BookManagementRepository"
import type { Result } from "@/domain/result/Result"

export class BookManagementRepositoryImpl implements BookManagementRepository {
  constructor(
    private readonly bookManagementFakeDataSource: BookManagementFakeDataSource
  ) {}

  getBooks(): Promise<Result<Book[]>> {
    return this.bookManagementFakeDataSource.getBooks()
  }

  getBookById(bookId: string): Promise<Result<BookDetail | null>> {
    return this.bookManagementFakeDataSource.getBookById(bookId)
  }

  getAuthorNames(): Promise<Result<string[]>> {
    return this.bookManagementFakeDataSource.getAuthorNames()
  }

  getTranslatorNames(): Promise<Result<string[]>> {
    return this.bookManagementFakeDataSource.getTranslatorNames()
  }

  createBook(input: CreateBookInput): Promise<Result<Book>> {
    return this.bookManagementFakeDataSource.createBook(input)
  }

  updateBook(input: UpdateBookInput): Promise<Result<Book>> {
    return this.bookManagementFakeDataSource.updateBook(input)
  }

  deleteBook(bookId: string): Promise<Result<null>> {
    return this.bookManagementFakeDataSource.deleteBook(bookId)
  }
}
