"use client"

import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { CreateBookScreen } from "@/presentation/screens/books/CreateBookScreen"

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function CreateBookPage() {
  return <CreateBookScreen getBooksUseCase={getBooksUseCase} />
}
