import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { Shelf, ShelfSummary } from "@/domain/entities/shelf/Shelf"
import type {
  CreateShelfBookInput,
  CreateShelfInput,
  ShelfBranchOption,
  ShelfManagementRepository,
  UpdateShelfBookInput,
  UpdateShelfInput,
} from "@/domain/repositories/ShelfManagementRepository"
import type { Result } from "@/domain/result/Result"

export class ShelfManagementUseCase {
  constructor(
    private readonly shelfManagementRepository: ShelfManagementRepository
  ) {}

  getShelves(): Promise<Result<Shelf[]>> {
    return this.shelfManagementRepository.getShelves()
  }

  getShelfById(shelfId: string): Promise<Result<Shelf | null>> {
    return this.shelfManagementRepository.getShelfById(shelfId)
  }

  getShelfBooks(shelfId: string): Promise<Result<ShelfBook[]>> {
    return this.shelfManagementRepository.getShelfBooks(shelfId)
  }

  getShelfBookById(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<ShelfBook | null>> {
    return this.shelfManagementRepository.getShelfBookById(shelfId, shelfBookId)
  }

  createShelfBook(
    shelfId: string,
    input: CreateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    return this.shelfManagementRepository.createShelfBook(shelfId, input)
  }

  updateShelfBook(
    shelfId: string,
    input: UpdateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    return this.shelfManagementRepository.updateShelfBook(shelfId, input)
  }

  deleteShelfBook(shelfId: string, shelfBookId: string): Promise<Result<null>> {
    return this.shelfManagementRepository.deleteShelfBook(shelfId, shelfBookId)
  }

  getShelfSummary(): Promise<Result<ShelfSummary>> {
    return this.shelfManagementRepository.getShelfSummary()
  }

  getBranchOptions(): Promise<Result<ShelfBranchOption[]>> {
    return this.shelfManagementRepository.getBranchOptions()
  }

  getLocationOptions(): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.getLocationOptions()
  }

  addLocationStep(label: string): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.addLocationStep(label)
  }

  updateLocationStep(
    stepId: string,
    label: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.updateLocationStep(stepId, label)
  }

  deleteLocationStep(stepId: string): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.deleteLocationStep(stepId)
  }

  addLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.addLocationValue(stepId, value)
  }

  updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.updateLocationValue(
      stepId,
      currentValue,
      value
    )
  }

  deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.shelfManagementRepository.deleteLocationValue(stepId, value)
  }

  createShelf(input: CreateShelfInput): Promise<Result<Shelf>> {
    return this.shelfManagementRepository.createShelf(input)
  }

  updateShelf(input: UpdateShelfInput): Promise<Result<Shelf>> {
    return this.shelfManagementRepository.updateShelf(input)
  }

  deleteShelf(shelfId: string): Promise<Result<null>> {
    return this.shelfManagementRepository.deleteShelf(shelfId)
  }
}
