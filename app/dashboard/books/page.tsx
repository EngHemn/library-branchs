"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { BookingManagementRepositoryImpl } from "@/data/repositories/BookingManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { BooksScreen } from "@/presentation/screens/books/BooksScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

const bookingManagementFakeDataSource = new BookingManagementFakeDataSource()
const bookingManagementRepository = new BookingManagementRepositoryImpl(
  bookingManagementFakeDataSource
)
const bookingManagementUseCase = new BookingManagementUseCase(
  bookingManagementRepository
)

export default function Page() {
  return (
    <BooksScreen
      authUseCase={authUseCase}
      getBooksUseCase={getBooksUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
      bookingManagementUseCase={bookingManagementUseCase}
    />
  )
}
