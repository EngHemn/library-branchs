import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeStaff } from "@/data/fake/fakeStaff"
import type { Translator } from "@/domain/entities/translator/Translator"
import type {
  TranslatorBookItem,
  TranslatorDetail,
} from "@/domain/entities/translator/TranslatorDetail"
import type { Book } from "@/domain/entities/book/Book"

const translatorCreatedAtById: Record<string, string> = {
  "TR-001": "2023-05-10",
  "TR-002": "2023-07-22",
  "TR-003": "2024-01-15",
  "TR-004": "2024-03-08",
  "TR-005": "2024-06-19",
  "TR-006": "2024-09-01",
  "TR-007": "2024-09-01",
  "TR-008": "2025-02-14",
}

function toTranslatorBookItem(book: Book): TranslatorBookItem {
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

function getBooksTranslated(translatorName: string): TranslatorBookItem[] {
  return fakeBooks
    .filter((book) => book.translator === translatorName)
    .map(toTranslatorBookItem)
}

export function toTranslatorDetail(translator: Translator): TranslatorDetail {
  const branch = fakeBranches.find((item) => item.id === translator.branchId)
  const branchStaff = fakeStaff.filter(
    (staff) => staff.branchId === translator.branchId
  )
  const staffIndex =
    translator.id.charCodeAt(translator.id.length - 1) % branchStaff.length
  const addedByStaff = branchStaff[staffIndex] ?? fakeStaff[0]

  const translatedBooks = getBooksTranslated(translator.name)

  return {
    ...translator,
    totalBooks:
      translatedBooks.length > 0
        ? translatedBooks.length
        : translator.totalBooks,
    branchName: branch?.branchName ?? "Unknown Branch",
    createdAt: translatorCreatedAtById[translator.id] ?? "2024-01-01",
    createdBy: {
      staffId: addedByStaff.id,
      staffName: addedByStaff.staffName,
    },
    translatedBooks,
  }
}
