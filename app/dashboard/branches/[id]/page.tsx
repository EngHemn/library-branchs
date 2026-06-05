"use client"

import { use } from "react"

<<<<<<< HEAD
import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { BranchDetailRepositoryImpl } from "@/data/repositories/BranchDetailRepositoryImpl"
import { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
=======
import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import { BranchDetailRepositoryImpl } from "@/data/repositories/BranchDetailRepositoryImpl"
import { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import { ViewBranchScreen } from "@/presentation/screens/branch-management/ViewBranchScreen"

type ViewBranchPageProps = {
  params: Promise<{
    id: string
  }>
}

const branchDetailFakeDataSource = new BranchDetailFakeDataSource()
const branchDetailRepository = new BranchDetailRepositoryImpl(
  branchDetailFakeDataSource
)
const branchDetailUseCase = new BranchDetailUseCase(branchDetailRepository)

<<<<<<< HEAD
const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
export default function ViewBranchPage({ params }: ViewBranchPageProps) {
  const { id } = use(params)

  return (
    <ViewBranchScreen
      branchId={id}
      branchDetailUseCase={branchDetailUseCase}
<<<<<<< HEAD
      getBooksUseCase={getBooksUseCase}
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    />
  )
}
