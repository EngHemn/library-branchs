import type { Book } from "@/domain/entities/book/Book"
import type { BookDetail } from "@/domain/entities/book/BookDetail"
import type {
  CreateBookInput,
  UpdateBookInput,
} from "@/domain/repositories/BookManagementRepository"
import type { Result } from "@/domain/result/Result"
import { fakeAuthors } from "@/data/fake/fakeAuthors"
import { fakeBookDetails } from "@/data/fake/fakeBookDetails"
import { fakeBooks } from "@/data/fake/fakeBooks"
import {
  appendLibraryBook,
  getLibraryBooksSnapshot,
  removeLibraryBook,
  replaceLibraryBook,
} from "@/data/shared/libraryBooksStore"
import { fakeBookings } from "@/data/fake/fakeBookings"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeMembers } from "@/data/fake/fakeMembers"
import { fakeTranslators } from "@/data/fake/fakeTranslators"
import type { BookingRecord } from "@/domain/entities/book/BookDetail"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let nextId = 100

const branchIdByName = Object.fromEntries(
  fakeBranches.map((branch) => [branch.branchName, branch.id])
)

const memberIdByName = Object.fromEntries(
  fakeMembers.map((member) => [member.memberName, member.id])
)

const memberIdByBookingId = Object.fromEntries(
  fakeBookings.map((booking) => [booking.bookingId, booking.memberId])
)

function enrichBookingRecord(
  booking: BookingRecord,
  branchStocks: { branchId: string; branchName: string }[]
): BookingRecord {
  const branchIdFromStock = branchStocks.find(
    (stock) => stock.branchName === booking.branchName
  )?.branchId

  return {
    ...booking,
    branchId:
      booking.branchId ??
      branchIdFromStock ??
      branchIdByName[booking.branchName],
    memberId:
      booking.memberId ??
      memberIdByBookingId[booking.bookingId] ??
      memberIdByName[booking.memberName],
  }
}

function cloneBookDetail(detail: BookDetail): BookDetail {
  return {
    ...detail,
    branchStocks: detail.branchStocks.map((stock) => ({ ...stock })),
    bookingHistory: detail.bookingHistory.map((booking) =>
      enrichBookingRecord(booking, detail.branchStocks)
    ),
  }
}

export class BookManagementFakeDataSource {
  private books: Book[] = getLibraryBooksSnapshot()
  private bookDetails: BookDetail[] = fakeBookDetails.map(cloneBookDetail)

  async getBooks(): Promise<Result<Book[]>> {
    await delay(350)

    return {
      success: true,
      data: this.books.map((book) => ({ ...book })),
    }
  }

  async getBookById(bookId: string): Promise<Result<BookDetail | null>> {
    await delay(300)

    const detail = this.bookDetails.find((d) => d.id === bookId)

    return {
      success: true,
      data: detail ? cloneBookDetail(detail) : null,
    }
  }

  async getAuthorNames(): Promise<Result<string[]>> {
    await delay(200)
    return {
      success: true,
      data: fakeAuthors.map((a) => a.name),
    }
  }

  async getTranslatorNames(): Promise<Result<string[]>> {
    await delay(200)
    return {
      success: true,
      data: fakeTranslators.map((t) => t.name),
    }
  }

  async createBook(input: CreateBookInput): Promise<Result<Book>> {
    await delay(400)

    const id = `BK-NEW-${String(nextId++)}`
    const branch = fakeBranches.find((b) => b.id === input.branchId)

    const newBook: Book = {
      id,
      title: input.title,
      coverUrl: input.coverUrl ?? null,
      language: input.language,
      category: input.category,
      author: input.author,
      translator: input.translator || null,
      isbn: input.isbn,
      stock: input.stock,
      available: input.available,
      minAlert: input.minAlert,
      status: input.available > 0 ? "available" : "unavailable",
      initialPrice: input.initialPrice,
      price: input.price,
      branchId: input.branchId,
      firstAddedBranch: branch?.branchName ?? "Unknown Branch",
      branchCount: 1,
    }

    this.books.push({ ...newBook })
    appendLibraryBook(newBook)

    const newDetail: BookDetail = {
      ...newBook,
      description: input.description,
      pages: input.pages,
      publicationDate: input.publicationDate,
      shelfHint: input.shelfHint,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: { staffId: "ST-001", staffName: "System" },
      activeBookings: 0,
      totalSold: 0,
      branchStocks: [
        {
          branchId: input.branchId,
          branchName: branch?.branchName ?? "Unknown Branch",
          available: input.available,
          reserved: 0,
          borrowed: 0,
          event: 0,
          sold: 0,
          damaged: 0,
          lost: 0,
        },
      ],
      bookingHistory: [],
    }

    this.bookDetails.push(newDetail)

    return { success: true, data: { ...newBook } }
  }

  async updateBook(input: UpdateBookInput): Promise<Result<Book>> {
    await delay(400)

    const bookIndex = this.books.findIndex((b) => b.id === input.id)

    if (bookIndex === -1) {
      return { success: false, error: "Book not found." }
    }

    const branch = fakeBranches.find((b) => b.id === input.branchId)
    const existing = this.books[bookIndex]

    const updatedBook: Book = {
      ...existing,
      title: input.title,
      coverUrl: input.coverUrl ?? existing.coverUrl ?? null,
      language: input.language,
      category: input.category,
      author: input.author,
      translator: input.translator || null,
      isbn: input.isbn,
      stock: input.stock,
      available: input.available,
      minAlert: input.minAlert,
      initialPrice: input.initialPrice,
      price: input.price,
      status: input.available > 0 ? "available" : existing.status,
      branchId: input.branchId,
      firstAddedBranch: branch?.branchName ?? existing.firstAddedBranch,
    }

    this.books[bookIndex] = updatedBook
    replaceLibraryBook(updatedBook)

    const detailIndex = this.bookDetails.findIndex((d) => d.id === input.id)

    if (detailIndex !== -1) {
      this.bookDetails[detailIndex] = {
        ...this.bookDetails[detailIndex],
        ...updatedBook,
        description: input.description,
        pages: input.pages,
        publicationDate: input.publicationDate,
        shelfHint: input.shelfHint,
      }

      const primaryBranchStock = this.bookDetails[detailIndex].branchStocks[0]
      if (primaryBranchStock) {
        primaryBranchStock.available = input.available
      }
    }

    return { success: true, data: { ...updatedBook } }
  }

  async deleteBook(bookId: string): Promise<Result<null>> {
    await delay(200)

    const bookExists = this.books.some((book) => book.id === bookId)

    if (!bookExists) {
      return {
        success: false,
        error: "Book could not be found.",
      }
    }

    this.books = this.books.filter((book) => book.id !== bookId)
    removeLibraryBook(bookId)

    return {
      success: true,
      data: null,
    }
  }
}
