import { fakeBooks } from "@/data/fake/fakeBooks"

export function countBooksForCategoryName(categoryName: string): number {
  return fakeBooks.filter((book) => book.category === categoryName).length
}

export function reassignBookCategories(
  fromCategoryNames: string[],
  toCategoryName: string
): void {
  for (const book of fakeBooks) {
    if (fromCategoryNames.includes(book.category)) {
      book.category = toCategoryName
    }
  }
}
