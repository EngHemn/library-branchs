import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeShelfLocationOptions } from "@/data/fake/fakeShelfLocationOptions"
import {
  fakeShelfBookCounts,
  fakeShelfSeeds,
} from "@/data/fake/fakeShelves"
import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeShelfBooks as initialFakeShelfBooks } from "@/data/fake/fakeShelfBooks"
import {
  buildLocationParts,
  cloneShelfLocationOptions,
  type ShelfLocationOptions,
  type ShelfLocationPart,
} from "@/domain/entities/shelf/ShelfLocationOptions"
import type { Shelf, ShelfSummary } from "@/domain/entities/shelf/Shelf"
import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import type {
  CreateShelfBookInput,
  CreateShelfInput,
  ShelfBranchOption,
  UpdateShelfBookInput,
  UpdateShelfInput,
} from "@/domain/repositories/ShelfManagementRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withBookCounts(
  seeds: Omit<Shelf, "bookCount">[]
): Shelf[] {
  return seeds.map((seed) => ({
    ...seed,
    bookCount: fakeShelfBookCounts[seed.id] ?? 0,
  }))
}

function buildSummary(shelves: Shelf[]): ShelfSummary {
  return {
    totalShelves: shelves.length,
    mainBranchShelves: shelves.filter((shelf) => shelf.branchType === "main")
      .length,
    subBranchShelves: shelves.filter((shelf) => shelf.branchType === "sub")
      .length,
    activeShelves: shelves.filter((shelf) => shelf.status === "active").length,
  }
}

function buildShelfCode(parts: ShelfLocationPart[]): string {
  return parts
    .map((part) =>
      part.value
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .split(/\s+/)
        .map((word) => word.slice(0, 3))
        .join("")
        .toUpperCase()
    )
    .filter(Boolean)
    .join("-")
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

function hasDuplicateValue(values: string[], value: string): boolean {
  const normalized = normalizeText(value).toLowerCase()
  return values.some((item) => item.toLowerCase() === normalized)
}

let nextShelfId = 11
let nextLocationStepId = 4
let nextShelfBookId = 1000

const BAY_STEP_ID = "LOC-STEP-BAY"
const BAY_STEP_LABEL = "Bay"
const SLOT_STEP_ID = "LOC-STEP-SLOT"
const SLOT_STEP_LABEL = "Slot"

export class ShelfManagementFakeDataSource {
  private shelves: Shelf[] = withBookCounts(
    fakeShelfSeeds.map((seed) => ({ ...seed }))
  )
  private shelfBooks: ShelfBook[] = initialFakeShelfBooks.map((book) => ({
    ...book,
    locationParts: book.locationParts.map((part) => ({ ...part })),
  }))

  private locationOptions: ShelfLocationOptions = cloneShelfLocationOptions(
    fakeShelfLocationOptions
  )

  private getLocationSnapshot(): ShelfLocationOptions {
    return cloneShelfLocationOptions(this.locationOptions)
  }

  private getStepIndex(stepId: string): number {
    return this.locationOptions.steps.findIndex((step) => step.id === stepId)
  }

  private refreshShelfCodes(shelf: Shelf): Shelf {
    return {
      ...shelf,
      code: buildShelfCode(shelf.locationParts),
    }
  }

  private buildLocationPartsFromInput(
    input: ShelfFormValues
  ): Result<ShelfLocationPart[]> {
    const parts = buildLocationParts(
      this.locationOptions.steps,
      input.locationValues
    )

    if (parts.length !== this.locationOptions.steps.length) {
      return {
        success: false,
        error: "Complete every location step before saving.",
      }
    }

    return { success: true, data: parts }
  }

  async getShelves(): Promise<Result<Shelf[]>> {
    await delay(300)
    return {
      success: true,
      data: this.shelves.map((shelf) => ({ ...shelf })),
    }
  }

  async getShelfById(shelfId: string): Promise<Result<Shelf | null>> {
    await delay(200)
    const shelf = this.shelves.find((item) => item.id === shelfId)
    if (!shelf) {
      return { success: true, data: null }
    }
    return { success: true, data: { ...shelf } }
  }

  async getShelfBooks(shelfId: string): Promise<Result<ShelfBook[]>> {
    await delay(250)
    const shelf = this.shelves.find((item) => item.id === shelfId)
    if (!shelf) {
      return { success: false, error: "Shelf not found." }
    }
    return {
      success: true,
      data: this.shelfBooks
        .filter((book) => book.shelfId === shelfId)
        .map((book) => ({
          ...book,
          locationParts: book.locationParts.map((part) => ({ ...part })),
        })),
    }
  }

  async getShelfBookById(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<ShelfBook | null>> {
    await delay(200)
    const shelf = this.shelves.find((item) => item.id === shelfId)
    if (!shelf) {
      return { success: false, error: "Shelf not found." }
    }
    const book = this.shelfBooks.find(
      (item) => item.shelfId === shelfId && item.id === shelfBookId
    )
    if (!book) {
      return { success: true, data: null }
    }
    return {
      success: true,
      data: {
        ...book,
        locationParts: book.locationParts.map((part) => ({ ...part })),
      },
    }
  }

  async createShelfBook(
    shelfId: string,
    input: CreateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    await delay(350)

    const shelfIndex = this.shelves.findIndex((item) => item.id === shelfId)
    if (shelfIndex === -1) {
      return { success: false, error: "Shelf not found." }
    }

    const catalogBook = fakeBooks.find((item) => item.id === input.bookId)
    if (!catalogBook) {
      return { success: false, error: "Selected book was not found." }
    }

    const shelf = this.shelves[shelfIndex]
    const totalQuantityOnShelf = this.shelfBooks
      .filter((item) => item.shelfId === shelfId)
      .reduce((sum, item) => sum + item.quantity, 0)

    if (totalQuantityOnShelf + input.quantity > shelf.capacity) {
      return {
        success: false,
        error: "Adding this quantity would exceed the shelf capacity.",
      }
    }

    const duplicate = this.shelfBooks.find(
      (item) =>
        item.shelfId === shelfId &&
        item.bookId === input.bookId &&
        item.locationParts.some(
          (part) => part.stepId === BAY_STEP_ID && part.value === input.bayValue
        ) &&
        item.locationParts.some(
          (part) =>
            part.stepId === SLOT_STEP_ID && part.value === input.slotValue
        )
    )
    if (duplicate) {
      return {
        success: false,
        error: "This book is already assigned to the selected bay and slot.",
      }
    }

    const locationParts: ShelfLocationPart[] = [
      ...shelf.locationParts.map((part) => ({ ...part })),
      {
        stepId: BAY_STEP_ID,
        stepLabel: BAY_STEP_LABEL,
        value: input.bayValue,
      },
      {
        stepId: SLOT_STEP_ID,
        stepLabel: SLOT_STEP_LABEL,
        value: input.slotValue,
      },
    ]

    const newBook: ShelfBook = {
      id: `SB-${String(nextShelfBookId++).padStart(4, "0")}`,
      shelfId,
      bookId: catalogBook.id,
      title: catalogBook.title,
      author: catalogBook.author,
      isbn: catalogBook.isbn,
      category: catalogBook.category,
      language: catalogBook.language,
      locationParts,
      quantity: input.quantity,
    }

    this.shelfBooks.push(newBook)
    this.syncShelfBookCount(shelfId)

    return {
      success: true,
      data: {
        ...newBook,
        locationParts: newBook.locationParts.map((part) => ({ ...part })),
      },
    }
  }

  async updateShelfBook(
    shelfId: string,
    input: UpdateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    await delay(350)

    const shelfIndex = this.shelves.findIndex((item) => item.id === shelfId)
    if (shelfIndex === -1) {
      return { success: false, error: "Shelf not found." }
    }

    const bookIndex = this.shelfBooks.findIndex(
      (item) => item.shelfId === shelfId && item.id === input.id
    )
    if (bookIndex === -1) {
      return { success: false, error: "Shelf book record not found." }
    }

    const shelf = this.shelves[shelfIndex]
    const currentBook = this.shelfBooks[bookIndex]
    const totalQuantityOnShelf = this.shelfBooks
      .filter((item) => item.shelfId === shelfId && item.id !== input.id)
      .reduce((sum, item) => sum + item.quantity, 0)

    if (totalQuantityOnShelf + input.quantity > shelf.capacity) {
      return {
        success: false,
        error: "This quantity would exceed the shelf capacity.",
      }
    }

    const duplicate = this.shelfBooks.find(
      (item) =>
        item.shelfId === shelfId &&
        item.id !== input.id &&
        item.bookId === currentBook.bookId &&
        item.locationParts.some(
          (part) => part.stepId === BAY_STEP_ID && part.value === input.bayValue
        ) &&
        item.locationParts.some(
          (part) =>
            part.stepId === SLOT_STEP_ID && part.value === input.slotValue
        )
    )
    if (duplicate) {
      return {
        success: false,
        error: "Another record already uses this bay and slot for the same book.",
      }
    }

    const locationParts: ShelfLocationPart[] = [
      ...shelf.locationParts.map((part) => ({ ...part })),
      {
        stepId: BAY_STEP_ID,
        stepLabel: BAY_STEP_LABEL,
        value: input.bayValue,
      },
      {
        stepId: SLOT_STEP_ID,
        stepLabel: SLOT_STEP_LABEL,
        value: input.slotValue,
      },
    ]

    const updatedBook: ShelfBook = {
      ...currentBook,
      locationParts,
      quantity: input.quantity,
    }

    this.shelfBooks[bookIndex] = updatedBook
    this.syncShelfBookCount(shelfId)

    return {
      success: true,
      data: {
        ...updatedBook,
        locationParts: updatedBook.locationParts.map((part) => ({ ...part })),
      },
    }
  }

  async deleteShelfBook(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<null>> {
    await delay(250)

    const shelf = this.shelves.find((item) => item.id === shelfId)
    if (!shelf) {
      return { success: false, error: "Shelf not found." }
    }

    const bookIndex = this.shelfBooks.findIndex(
      (item) => item.shelfId === shelfId && item.id === shelfBookId
    )
    if (bookIndex === -1) {
      return { success: false, error: "Shelf book record not found." }
    }

    this.shelfBooks.splice(bookIndex, 1)
    this.syncShelfBookCount(shelfId)

    return { success: true, data: null }
  }

  private syncShelfBookCount(shelfId: string): void {
    const shelfIndex = this.shelves.findIndex((item) => item.id === shelfId)
    if (shelfIndex === -1) return

    const bookCount = this.shelfBooks.filter(
      (item) => item.shelfId === shelfId
    ).length

    this.shelves[shelfIndex] = {
      ...this.shelves[shelfIndex],
      bookCount,
    }
    fakeShelfBookCounts[shelfId] = bookCount
  }

  async getShelfSummary(): Promise<Result<ShelfSummary>> {
    await delay(200)
    return {
      success: true,
      data: buildSummary(this.shelves),
    }
  }

  async getBranchOptions(): Promise<Result<ShelfBranchOption[]>> {
    await delay(150)
    return {
      success: true,
      data: fakeBranches
        .filter((branch) => branch.status === "active")
        .map((branch) => ({
          id: branch.id,
          name: branch.branchName,
        })),
    }
  }

  async getLocationOptions(): Promise<Result<ShelfLocationOptions>> {
    await delay(150)
    return {
      success: true,
      data: this.getLocationSnapshot(),
    }
  }

  async addLocationStep(label: string): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    const normalizedLabel = normalizeText(label)
    if (!normalizedLabel) {
      return { success: false, error: "Step name is required." }
    }

    const duplicate = this.locationOptions.steps.some(
      (step) => step.label.toLowerCase() === normalizedLabel.toLowerCase()
    )
    if (duplicate) {
      return { success: false, error: "This location step already exists." }
    }

    const stepId = `LOC-STEP-${String(nextLocationStepId++).padStart(3, "0")}`
    this.locationOptions.steps.push({ id: stepId, label: normalizedLabel })
    this.locationOptions.valuesByStepId[stepId] = []
    return { success: true, data: this.getLocationSnapshot() }
  }

  async updateLocationStep(
    stepId: string,
    label: string
  ): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    const stepIndex = this.getStepIndex(stepId)
    if (stepIndex === -1) {
      return { success: false, error: "Location step not found." }
    }

    const normalizedLabel = normalizeText(label)
    if (!normalizedLabel) {
      return { success: false, error: "Step name is required." }
    }

    const duplicate = this.locationOptions.steps.some(
      (step, index) =>
        index !== stepIndex &&
        step.label.toLowerCase() === normalizedLabel.toLowerCase()
    )
    if (duplicate) {
      return { success: false, error: "This location step already exists." }
    }

    this.locationOptions.steps[stepIndex] = {
      ...this.locationOptions.steps[stepIndex],
      label: normalizedLabel,
    }

    this.shelves = this.shelves.map((shelf) => ({
      ...shelf,
      locationParts: shelf.locationParts.map((part) =>
        part.stepId === stepId ? { ...part, stepLabel: normalizedLabel } : part
      ),
    }))

    return { success: true, data: this.getLocationSnapshot() }
  }

  async deleteLocationStep(
    stepId: string
  ): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    const stepIndex = this.getStepIndex(stepId)
    if (stepIndex === -1) {
      return { success: false, error: "Location step not found." }
    }

    if (this.locationOptions.steps.length <= 1) {
      return {
        success: false,
        error: "At least one location step is required.",
      }
    }

    const inUse = this.shelves.some((shelf) =>
      shelf.locationParts.some((part) => part.stepId === stepId)
    )
    if (inUse) {
      return {
        success: false,
        error: "Cannot delete a step that is used by existing shelves.",
      }
    }

    this.locationOptions.steps = this.locationOptions.steps.filter(
      (step) => step.id !== stepId
    )
    delete this.locationOptions.valuesByStepId[stepId]
    return { success: true, data: this.getLocationSnapshot() }
  }

  async addLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    if (this.getStepIndex(stepId) === -1) {
      return { success: false, error: "Location step not found." }
    }

    const normalizedValue = normalizeText(value)
    if (!normalizedValue) {
      return { success: false, error: "Value is required." }
    }

    const values = this.locationOptions.valuesByStepId[stepId] ?? []
    if (hasDuplicateValue(values, normalizedValue)) {
      return { success: false, error: "This value already exists." }
    }

    this.locationOptions.valuesByStepId[stepId] = [...values, normalizedValue]
    return { success: true, data: this.getLocationSnapshot() }
  }

  async updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    if (this.getStepIndex(stepId) === -1) {
      return { success: false, error: "Location step not found." }
    }

    const normalizedCurrent = normalizeText(currentValue)
    const normalizedValue = normalizeText(value)
    const values = this.locationOptions.valuesByStepId[stepId] ?? []

    if (!values.includes(normalizedCurrent)) {
      return { success: false, error: "Value not found." }
    }
    if (!normalizedValue) {
      return { success: false, error: "Value is required." }
    }
    if (
      normalizedCurrent.toLowerCase() !== normalizedValue.toLowerCase() &&
      hasDuplicateValue(values, normalizedValue)
    ) {
      return { success: false, error: "This value already exists." }
    }

    this.locationOptions.valuesByStepId[stepId] = values.map((item) =>
      item === normalizedCurrent ? normalizedValue : item
    )

    this.shelves = this.shelves.map((shelf) => ({
      ...shelf,
      locationParts: shelf.locationParts.map((part) =>
        part.stepId === stepId && part.value === normalizedCurrent
          ? { ...part, value: normalizedValue }
          : part
      ),
      ...(shelf.locationParts.some(
        (part) => part.stepId === stepId && part.value === normalizedCurrent
      )
        ? {}
        : {}),
    }))

    this.shelves = this.shelves.map((shelf) => this.refreshShelfCodes(shelf))

    return { success: true, data: this.getLocationSnapshot() }
  }

  async deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    await delay(250)
    if (this.getStepIndex(stepId) === -1) {
      return { success: false, error: "Location step not found." }
    }

    const normalizedValue = normalizeText(value)
    const values = this.locationOptions.valuesByStepId[stepId] ?? []
    if (!values.includes(normalizedValue)) {
      return { success: false, error: "Value not found." }
    }

    const inUse = this.shelves.some((shelf) =>
      shelf.locationParts.some(
        (part) => part.stepId === stepId && part.value === normalizedValue
      )
    )
    if (inUse) {
      return {
        success: false,
        error: "Cannot delete a value that is used by existing shelves.",
      }
    }

    this.locationOptions.valuesByStepId[stepId] = values.filter(
      (item) => item !== normalizedValue
    )
    return { success: true, data: this.getLocationSnapshot() }
  }

  async createShelf(input: CreateShelfInput): Promise<Result<Shelf>> {
    await delay(350)

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const partsResult = this.buildLocationPartsFromInput(input)
    if (!partsResult.success) {
      return partsResult
    }

    const locationParts = partsResult.data
    const normalizedCode = buildShelfCode(locationParts)
    const codeExists = this.shelves.some(
      (shelf) =>
        shelf.branchId === branch.id &&
        shelf.code.toUpperCase() === normalizedCode
    )
    if (codeExists) {
      return {
        success: false,
        error: "A shelf already exists at this location in the selected branch.",
      }
    }

    const newShelf: Shelf = {
      id: `SH-${String(nextShelfId++).padStart(3, "0")}`,
      name: input.name.trim(),
      code: normalizedCode,
      shelfType: input.shelfType,
      branchId: branch.id,
      branchName: branch.branchName,
      branchType: branch.type,
      locationParts,
      capacity: input.capacity,
      bookCount: 0,
      status: input.status,
    }

    this.shelves.push(newShelf)
    return { success: true, data: { ...newShelf } }
  }

  async updateShelf(input: UpdateShelfInput): Promise<Result<Shelf>> {
    await delay(350)

    const shelfIndex = this.shelves.findIndex((item) => item.id === input.id)
    if (shelfIndex === -1) {
      return { success: false, error: "Shelf not found." }
    }

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const partsResult = this.buildLocationPartsFromInput(input)
    if (!partsResult.success) {
      return partsResult
    }

    const locationParts = partsResult.data
    const normalizedCode = buildShelfCode(locationParts)
    const codeExists = this.shelves.some(
      (shelf, index) =>
        index !== shelfIndex &&
        shelf.branchId === branch.id &&
        shelf.code.toUpperCase() === normalizedCode
    )
    if (codeExists) {
      return {
        success: false,
        error: "A shelf already exists at this location in the selected branch.",
      }
    }

    const currentShelf = this.shelves[shelfIndex]
    const updatedShelf: Shelf = {
      ...currentShelf,
      name: input.name.trim(),
      code: normalizedCode,
      shelfType: input.shelfType,
      branchId: branch.id,
      branchName: branch.branchName,
      branchType: branch.type,
      locationParts,
      capacity: input.capacity,
      status: input.status,
    }

    this.shelves[shelfIndex] = updatedShelf
    return { success: true, data: { ...updatedShelf } }
  }

  async deleteShelf(shelfId: string): Promise<Result<null>> {
    await delay(250)

    const shelf = this.shelves.find((item) => item.id === shelfId)
    if (!shelf) {
      return { success: false, error: "Shelf could not be found." }
    }

    if (shelf.bookCount > 0) {
      return {
        success: false,
        error: "Cannot delete a shelf that still has books assigned to it.",
      }
    }

    this.shelves = this.shelves.filter((item) => item.id !== shelfId)
    return { success: true, data: null }
  }
}
