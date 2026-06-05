import { fakeBooks } from "@/data/fake/fakeBooks"
import type { Book } from "@/domain/entities/book/Book"

let libraryBooks: Book[] = fakeBooks.map((book) => ({ ...book }))

export function getLibraryBooksSnapshot(): Book[] {
  return libraryBooks.map((book) => ({ ...book }))
}

export function appendLibraryBook(book: Book): void {
  libraryBooks = [{ ...book }, ...libraryBooks]
}

export function replaceLibraryBook(book: Book): void {
  libraryBooks = libraryBooks.map((item) => (item.id === book.id ? { ...book } : item))
}

export function removeLibraryBook(bookId: string): void {
  libraryBooks = libraryBooks.filter((item) => item.id !== bookId)
}

export function findLibraryBookById(bookId: string): Book | undefined {
  return libraryBooks.find((item) => item.id === bookId)
}
