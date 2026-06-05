"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { CategoryManagementFakeDataSource } from "@/data/datasources/CategoryManagementFakeDataSource"
import { CategoryManagementRepositoryImpl } from "@/data/repositories/CategoryManagementRepositoryImpl"
import { GetCategoriesUseCase } from "@/domain/usecases/categories/GetCategoriesUseCase"
import { CategoriesScreen } from "@/presentation/screens/categories/CategoriesScreen"

const categoryManagementFakeDataSource = new CategoryManagementFakeDataSource()
const categoryManagementRepository = new CategoryManagementRepositoryImpl(
  categoryManagementFakeDataSource
)
const getCategoriesUseCase = new GetCategoriesUseCase(categoryManagementRepository)

function CategoriesPageFallback() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <Skeleton className="mt-4 h-8 w-48" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<CategoriesPageFallback />}>
      <CategoriesScreen getCategoriesUseCase={getCategoriesUseCase} />
    </Suspense>
  )
}
