import { fakeCategorySeeds } from "@/data/fake/fakeCategories"
import type { Category } from "@/domain/entities/category/Category"

export function getCategoryByName(name: string): Category | null {
  const seed = fakeCategorySeeds.find((item) => item.name === name)

  if (!seed) {
    return null
  }

  return {
    ...seed,
    totalBooks: 0,
  }
}
