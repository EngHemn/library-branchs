import {
  countBooksForCategoryName,
  reassignBookCategories,
} from "@/data/fake/categoryBookLinks"
import { fakeCategorySeeds } from "@/data/fake/fakeCategories"
import type { Category } from "@/domain/entities/category/Category"
import type {
  ConcatCategoriesInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/domain/repositories/CategoryManagementRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withBookCounts(seeds: Omit<Category, "totalBooks">[]): Category[] {
  return seeds.map((seed) => ({
    ...seed,
    totalBooks: countBooksForCategoryName(seed.name),
  }))
}

let nextCategoryId = 7

export class CategoryManagementFakeDataSource {
  private categories: Category[] = withBookCounts(
    fakeCategorySeeds.map((seed) => ({ ...seed }))
  )

  private refreshBookCounts(): void {
    this.categories = this.categories.map((category) => ({
      ...category,
      totalBooks: countBooksForCategoryName(category.name),
    }))
  }

  async getCategories(): Promise<Result<Category[]>> {
    await delay(300)
    this.refreshBookCounts()
    return {
      success: true,
      data: this.categories.map((category) => ({ ...category })),
    }
  }

  async createCategory(input: CreateCategoryInput): Promise<Result<Category>> {
    await delay(350)
    const normalizedName = input.name.trim()
    const exists = this.categories.some(
      (category) => category.name.toLowerCase() === normalizedName.toLowerCase()
    )
    if (exists) {
      return {
        success: false,
        error: "A category with this name already exists.",
      }
    }

    const newCategory: Category = {
      id: `C${String(nextCategoryId++).padStart(3, "0")}`,
      name: normalizedName,
      description: input.description.trim(),
      totalBooks: 0,
      status: "active",
    }
    this.categories.push(newCategory)
    return { success: true, data: { ...newCategory } }
  }

  async updateCategory(input: UpdateCategoryInput): Promise<Result<Category>> {
    await delay(350)
    const categoryIndex = this.categories.findIndex(
      (item) => item.id === input.id
    )
    if (categoryIndex === -1) {
      return { success: false, error: "Category not found." }
    }

    const normalizedName = input.name.trim()
    const duplicate = this.categories.some(
      (category, index) =>
        index !== categoryIndex &&
        category.name.toLowerCase() === normalizedName.toLowerCase()
    )
    if (duplicate) {
      return {
        success: false,
        error: "A category with this name already exists.",
      }
    }

    const currentCategory = this.categories[categoryIndex]
    const updatedCategory: Category = {
      ...currentCategory,
      name: normalizedName,
      description: input.description.trim(),
      totalBooks: countBooksForCategoryName(normalizedName),
    }
    this.categories[categoryIndex] = updatedCategory
    return { success: true, data: { ...updatedCategory } }
  }

  async concatCategories(
    input: ConcatCategoriesInput
  ): Promise<Result<Category>> {
    await delay(400)

    if (input.sourceCategoryIds.length < 2) {
      return {
        success: false,
        error: "Select at least two categories to merge.",
      }
    }

    const sourceCategories = input.sourceCategoryIds.map((categoryId) =>
      this.categories.find((item) => item.id === categoryId)
    )

    if (sourceCategories.some((category) => !category)) {
      return {
        success: false,
        error: "One or more selected categories were not found.",
      }
    }

    const normalizedName = input.name.trim()
    const nameConflict = this.categories.some(
      (category) =>
        !input.sourceCategoryIds.includes(category.id) &&
        category.name.toLowerCase() === normalizedName.toLowerCase()
    )

    if (nameConflict) {
      return {
        success: false,
        error: "A category with this name already exists.",
      }
    }

    const sourceNames = sourceCategories.map((category) => category!.name)
    reassignBookCategories(sourceNames, normalizedName)

    this.categories = this.categories.filter(
      (category) => !input.sourceCategoryIds.includes(category.id)
    )

    const mergedCategory: Category = {
      id: `C${String(nextCategoryId++).padStart(3, "0")}`,
      name: normalizedName,
      description: input.description.trim(),
      status: input.status,
      totalBooks: countBooksForCategoryName(normalizedName),
    }

    this.categories.push(mergedCategory)
    return { success: true, data: { ...mergedCategory } }
  }

  async deleteCategory(categoryId: string): Promise<Result<null>> {
    await delay(250)
    const category = this.categories.find((item) => item.id === categoryId)
    if (!category) {
      return { success: false, error: "Category could not be found." }
    }

    if (category.totalBooks > 0) {
      return {
        success: false,
        error: "Cannot delete a category that has books assigned to it.",
      }
    }

    this.categories = this.categories.filter((item) => item.id !== categoryId)
    return { success: true, data: null }
  }
}
