"use client"

import { CategoryManagementFakeDataSource } from "@/data/datasources/CategoryManagementFakeDataSource"
import { CategoryManagementRepositoryImpl } from "@/data/repositories/CategoryManagementRepositoryImpl"
import { GetCategoriesUseCase } from "@/domain/usecases/categories/GetCategoriesUseCase"
import { CategoriesScreen } from "@/presentation/screens/categories/CategoriesScreen"

const categoryManagementFakeDataSource = new CategoryManagementFakeDataSource()
const categoryManagementRepository = new CategoryManagementRepositoryImpl(
  categoryManagementFakeDataSource
)
const getCategoriesUseCase = new GetCategoriesUseCase(categoryManagementRepository)

export default function Page() {
  return <CategoriesScreen getCategoriesUseCase={getCategoriesUseCase} />
}
