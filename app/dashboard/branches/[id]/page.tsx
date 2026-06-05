"use client"

import { use } from "react"

import { BookManagementFakeDataSource } from "@/data/datasources/BookManagementFakeDataSource"
import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import { BookManagementRepositoryImpl } from "@/data/repositories/BookManagementRepositoryImpl"
import { BranchDetailRepositoryImpl } from "@/data/repositories/BranchDetailRepositoryImpl"
import { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
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

const bookManagementFakeDataSource = new BookManagementFakeDataSource()
const bookManagementRepository = new BookManagementRepositoryImpl(
  bookManagementFakeDataSource
)
const getBooksUseCase = new GetBooksUseCase(bookManagementRepository)

export default function ViewBranchPage({ params }: ViewBranchPageProps) {
  const { id } = use(params)

  return (
    <ViewBranchScreen
      branchId={id}
      branchDetailUseCase={branchDetailUseCase}
      getBooksUseCase={getBooksUseCase}
    />
  )
}
