import type { Book } from "@/domain/entities/book/Book"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type {
  BookManagementRepository,
  CreateBookInput,
  UpdateBookInput,
} from "@/domain/repositories/BookManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetBooksUseCase {
  constructor(
    private readonly bookManagementRepository: BookManagementRepository
  ) {}

  getBooks(): Promise<Result<Book[]>> {
    return this.bookManagementRepository.getBooks()
  }

  getBookById(bookId: string): Promise<Result<BookDetail | null>> {
    return this.bookManagementRepository.getBookById(bookId)
  }

  getAuthorNames(): Promise<Result<string[]>> {
    return this.bookManagementRepository.getAuthorNames()
  }

  getTranslatorNames(): Promise<Result<string[]>> {
    return this.bookManagementRepository.getTranslatorNames()
  }

  createBook(input: CreateBookInput): Promise<Result<Book>> {
    return this.bookManagementRepository.createBook(input)
  }

  updateBook(input: UpdateBookInput): Promise<Result<Book>> {
    return this.bookManagementRepository.updateBook(input)
  }

  deleteBook(bookId: string): Promise<Result<null>> {
    return this.bookManagementRepository.deleteBook(bookId)
  }
}
