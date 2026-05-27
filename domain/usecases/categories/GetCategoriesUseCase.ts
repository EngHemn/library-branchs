import type { Category } from "@/domain/entities/category/Category"
import type {
  CategoryManagementRepository,
  ConcatCategoriesInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/domain/repositories/CategoryManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetCategoriesUseCase {
  constructor(
    private readonly categoryManagementRepository: CategoryManagementRepository
  ) {}

  getCategories(): Promise<Result<Category[]>> {
    return this.categoryManagementRepository.getCategories()
  }

  createCategory(input: CreateCategoryInput): Promise<Result<Category>> {
    return this.categoryManagementRepository.createCategory(input)
  }

  updateCategory(input: UpdateCategoryInput): Promise<Result<Category>> {
    return this.categoryManagementRepository.updateCategory(input)
  }

  concatCategories(input: ConcatCategoriesInput): Promise<Result<Category>> {
    return this.categoryManagementRepository.concatCategories(input)
  }

  deleteCategory(categoryId: string): Promise<Result<null>> {
    return this.categoryManagementRepository.deleteCategory(categoryId)
  }
}
