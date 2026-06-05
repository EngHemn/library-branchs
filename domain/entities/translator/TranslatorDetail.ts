import type { Translator } from "@/domain/entities/translator/Translator"
import type { BookStatus } from "@/domain/entities/book/Book"

export type TranslatorCreatedBy = {
  staffId: string
  staffName: string
}

export type TranslatorBookItem = {
  id: string
  title: string
  isbn: string
  language: string
  category: string
  author: string
  status: BookStatus
  firstAddedBranch: string
}

export type TranslatorDetail = Translator & {
  branchName: string
  createdAt: string
  createdBy: TranslatorCreatedBy
  translatedBooks: TranslatorBookItem[]
}
