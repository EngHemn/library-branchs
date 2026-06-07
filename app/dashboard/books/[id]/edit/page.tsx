"use client"

import { use } from "react"

import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { shelfManagementUseCase } from "@/app/dashboard/shelves/shelfDependencies"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { EditBookScreen } from "@/presentation/screens/books/EditBookScreen"

type EditBookPageProps = {
  params: Promise<{
    id: string
  }>
}

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function EditBookPage({ params }: EditBookPageProps) {
  const { id } = use(params)

  return (
    <EditBookScreen
      bookId={id}
      getBooksUseCase={getBooksUseCase}
      shelfManagementUseCase={shelfManagementUseCase}
    />
  )
}
