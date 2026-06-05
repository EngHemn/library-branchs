"use client"

import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { CreateStockScreen } from "@/presentation/screens/stock/CreateStockScreen"
import { stockUseCase } from "../stockDependencies"

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function CreateStockPage() {
  return (
    <CreateStockScreen
      authUseCase={dashboardAuthUseCase}
      getBooksUseCase={getBooksUseCase}
      stockUseCase={stockUseCase}
    />
  )
}
