import type { Category } from "@/domain/entities/category/Category"
import type { Result } from "@/domain/result/Result"

export type CreateCategoryInput = {
  name: string
  description: string
}

export type UpdateCategoryInput = CreateCategoryInput & {
  id: string
}

export type ConcatCategoriesInput = {
  sourceCategoryIds: string[]
  name: string
  description: string
  status: Category["status"]
}

export interface CategoryManagementRepository {
  getCategories(): Promise<Result<Category[]>>
  createCategory(input: CreateCategoryInput): Promise<Result<Category>>
  updateCategory(input: UpdateCategoryInput): Promise<Result<Category>>
  concatCategories(input: ConcatCategoriesInput): Promise<Result<Category>>
  deleteCategory(categoryId: string): Promise<Result<null>>
}
