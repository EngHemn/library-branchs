import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { Shelf, ShelfSummary } from "@/domain/entities/shelf/Shelf"
import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import type { ShelfBookFormValues } from "@/domain/schemas/shelfBookFormSchema"
import type { Result } from "@/domain/result/Result"

export type ShelfBranchOption = {
  id: string
  name: string
}

export type CreateShelfInput = ShelfFormValues

export type UpdateShelfInput = ShelfFormValues & {
  id: string
}

export type CreateShelfBookInput = ShelfBookFormValues

export type UpdateShelfBookInput = ShelfBookFormValues & {
  id: string
}

export interface ShelfManagementRepository {
  getShelves(): Promise<Result<Shelf[]>>
  getShelfById(shelfId: string): Promise<Result<Shelf | null>>
  getShelfBooks(shelfId: string): Promise<Result<ShelfBook[]>>
  getShelfBookById(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<ShelfBook | null>>
  createShelfBook(
    shelfId: string,
    input: CreateShelfBookInput
  ): Promise<Result<ShelfBook>>
  updateShelfBook(
    shelfId: string,
    input: UpdateShelfBookInput
  ): Promise<Result<ShelfBook>>
  deleteShelfBook(shelfId: string, shelfBookId: string): Promise<Result<null>>
  getShelfSummary(): Promise<Result<ShelfSummary>>
  getBranchOptions(): Promise<Result<ShelfBranchOption[]>>
  getLocationOptions(): Promise<Result<ShelfLocationOptions>>
  addLocationStep(label: string): Promise<Result<ShelfLocationOptions>>
  updateLocationStep(
    stepId: string,
    label: string
  ): Promise<Result<ShelfLocationOptions>>
  deleteLocationStep(stepId: string): Promise<Result<ShelfLocationOptions>>
  addLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>>
  updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>>
  deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>>
  createShelf(input: CreateShelfInput): Promise<Result<Shelf>>
  updateShelf(input: UpdateShelfInput): Promise<Result<Shelf>>
  deleteShelf(shelfId: string): Promise<Result<null>>
}
