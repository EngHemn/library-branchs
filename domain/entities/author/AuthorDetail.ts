import type { Author } from "@/domain/entities/author/Author"
import type { BookStatus } from "@/domain/entities/book/Book"

export type AuthorCreatedBy = {
  staffId: string
  staffName: string
}

export type AuthorBookItem = {
  id: string
  title: string
  isbn: string
  language: string
  category: string
  author: string
  status: BookStatus
  firstAddedBranch: string
}

export type AuthorDetail = Author & {
  branchName: string
  createdAt: string
  createdBy: AuthorCreatedBy
  totalBooksTranslated: number
  authoredBooks: AuthorBookItem[]
  translatedBooks: AuthorBookItem[]
}
