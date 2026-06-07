import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeShelfBookCounts, fakeShelfSeeds } from "@/data/fake/fakeShelves"
import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"

const bayStepId = "LOC-STEP-BAY"
const bayStepLabel = "Bay"
const bayValues = [
  "Left Bay",
  "Center Bay",
  "Right Bay",
  "Top Row",
  "Bottom Row",
]

const slotStepId = "LOC-STEP-SLOT"
const slotStepLabel = "Slot"

function buildFakeShelfBooks(): ShelfBook[] {
  const records: ShelfBook[] = []
  let entryId = 1

  for (const [shelfId, count] of Object.entries(fakeShelfBookCounts)) {
    if (count <= 0) continue

    const shelfSeed = fakeShelfSeeds.find((seed) => seed.id === shelfId)
    const shelfLocationParts = shelfSeed?.locationParts ?? []

    for (let index = 0; index < count; index += 1) {
      const book = fakeBooks[index % fakeBooks.length]

      records.push({
        id: `SB-${String(entryId).padStart(4, "0")}`,
        shelfId,
        bookId: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        language: book.language,
        locationParts: [
          ...shelfLocationParts.map((part) => ({ ...part })),
          {
            stepId: bayStepId,
            stepLabel: bayStepLabel,
            value: bayValues[index % bayValues.length],
          },
          {
            stepId: slotStepId,
            stepLabel: slotStepLabel,
            value: `Slot ${String((index % 20) + 1).padStart(2, "0")}`,
          },
        ],
        quantity: 1,
      })

      entryId += 1
    }
  }

  return records
}

export const fakeShelfBooks: ShelfBook[] = buildFakeShelfBooks()

export function getFakeShelfBooks(shelfId: string): ShelfBook[] {
  return fakeShelfBooks.filter((book) => book.shelfId === shelfId)
}
