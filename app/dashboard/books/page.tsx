"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BooksScreen } from "@/presentation/screens/books/BooksScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function Page() {
  return (
    <BooksScreen
      authUseCase={authUseCase}
      getBooksUseCase={getBooksUseCase}
    />
  )
}
