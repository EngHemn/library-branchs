"use client"

import { use } from "react"

import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { ViewBookScreen } from "@/presentation/screens/books/ViewBookScreen"

type ViewBookPageProps = {
  params: Promise<{
    id: string
  }>
}

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function ViewBookPage({ params }: ViewBookPageProps) {
  const { id } = use(params)

  return (
    <ViewBookScreen
      bookId={id}
      getBooksUseCase={getBooksUseCase}
    />
  )
}
