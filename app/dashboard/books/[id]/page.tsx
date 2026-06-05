"use client"

import { use } from "react"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { BookingManagementRepositoryImpl } from "@/data/repositories/BookingManagementRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { ViewBookScreen } from "@/presentation/screens/books/ViewBookScreen"

type ViewBookPageProps = {
  params: Promise<{
    id: string
  }>
}

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

export default function ViewBookPage({ params }: ViewBookPageProps) {
  const { id } = use(params)

  return (
    <ViewBookScreen
      bookId={id}
      authUseCase={authUseCase}
      getBooksUseCase={getBooksUseCase}
      bookingManagementUseCase={bookingManagementUseCase}
    />
  )
}
