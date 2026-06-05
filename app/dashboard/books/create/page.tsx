"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
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
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      }
    >
      <CreateBookScreen getBooksUseCase={getBooksUseCase} />
    </Suspense>
  )
}
