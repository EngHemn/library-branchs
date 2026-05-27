import { CategoryManagementFakeDataSource } from "@/data/datasources/CategoryManagementFakeDataSource"
import type { Category } from "@/domain/entities/category/Category"
import type {
  CategoryManagementRepository,
  ConcatCategoriesInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/domain/repositories/CategoryManagementRepository"
import type { Result } from "@/domain/result/Result"

export class CategoryManagementRepositoryImpl
  implements CategoryManagementRepository
{
  constructor(
    private readonly categoryManagementFakeDataSource: CategoryManagementFakeDataSource
  ) {}

  getCategories(): Promise<Result<Category[]>> {
    return this.categoryManagementFakeDataSource.getCategories()
  }

  createCategory(input: CreateCategoryInput): Promise<Result<Category>> {
    return this.categoryManagementFakeDataSource.createCategory(input)
  }

  updateCategory(input: UpdateCategoryInput): Promise<Result<Category>> {
    return this.categoryManagementFakeDataSource.updateCategory(input)
  }

  concatCategories(input: ConcatCategoriesInput): Promise<Result<Category>> {
    return this.categoryManagementFakeDataSource.concatCategories(input)
  }

  deleteCategory(categoryId: string): Promise<Result<null>> {
    return this.categoryManagementFakeDataSource.deleteCategory(categoryId)
  }
}
