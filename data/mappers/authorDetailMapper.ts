import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeStaff } from "@/data/fake/fakeStaff"
import type { Author } from "@/domain/entities/author/Author"
import type {
  AuthorBookItem,
  AuthorDetail,
} from "@/domain/entities/author/AuthorDetail"
import type { Book } from "@/domain/entities/book/Book"

const authorCreatedAtById: Record<string, string> = {
  "AU-001": "2023-03-12",
  "AU-002": "2023-04-18",
  "AU-003": "2023-06-02",
  "AU-004": "2023-08-21",
  "AU-005": "2023-01-09",
  "AU-006": "2024-02-14",
  "AU-007": "2024-05-30",
  "AU-008": "2024-07-11",
  "AU-009": "2024-09-03",
  "AU-010": "2025-01-17",
  "AU-011": "2025-02-22",
  "AU-012": "2025-04-08",
  "AU-013": "2025-06-19",
}

function toAuthorBookItem(book: Book): AuthorBookItem {
  return {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    language: book.language,
    category: book.category,
    author: book.author,
    status: book.status,
    firstAddedBranch: book.firstAddedBranch,
  }
}

function getBooksAuthored(authorName: string): AuthorBookItem[] {
  return fakeBooks
    .filter((book) => book.author === authorName)
    .map(toAuthorBookItem)
}

function getBooksTranslated(authorName: string): AuthorBookItem[] {
  return fakeBooks
    .filter((book) => book.translator === authorName)
    .map(toAuthorBookItem)
}

export function toAuthorDetail(author: Author): AuthorDetail {
  const branch = fakeBranches.find((item) => item.id === author.branchId)
  const branchStaff = fakeStaff.filter(
    (staff) => staff.branchId === author.branchId
  )
  const staffIndex =
    author.id.charCodeAt(author.id.length - 1) % branchStaff.length
  const addedByStaff = branchStaff[staffIndex] ?? fakeStaff[0]

  const authoredBooks = getBooksAuthored(author.name)
  const translatedBooks = getBooksTranslated(author.name)

  return {
    ...author,
    totalBooks:
      authoredBooks.length > 0 ? authoredBooks.length : author.totalBooks,
    branchName: branch?.branchName ?? "Unknown Branch",
    createdAt: authorCreatedAtById[author.id] ?? "2024-01-01",
    createdBy: {
      staffId: addedByStaff.id,
      staffName: addedByStaff.staffName,
    },
    totalBooksTranslated: translatedBooks.length,
    authoredBooks,
    translatedBooks,
  }
}
