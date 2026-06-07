import type { ShelfManagementFakeDataSource } from "@/data/datasources/ShelfManagementFakeDataSource"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { ShelfBook } from "@/domain/entities/shelf/ShelfBook"
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

export class ShelfManagementRepositoryImpl implements ShelfManagementRepository {
  constructor(
    private readonly dataSource: ShelfManagementFakeDataSource
  ) {}

  getShelves(): Promise<Result<Shelf[]>> {
    return this.dataSource.getShelves()
  }

  getShelfById(shelfId: string): Promise<Result<Shelf | null>> {
    return this.dataSource.getShelfById(shelfId)
  }

  getShelfBooks(shelfId: string): Promise<Result<ShelfBook[]>> {
    return this.dataSource.getShelfBooks(shelfId)
  }

  getShelfBookById(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<ShelfBook | null>> {
    return this.dataSource.getShelfBookById(shelfId, shelfBookId)
  }

  createShelfBook(
    shelfId: string,
    input: CreateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    return this.dataSource.createShelfBook(shelfId, input)
  }

  updateShelfBook(
    shelfId: string,
    input: UpdateShelfBookInput
  ): Promise<Result<ShelfBook>> {
    return this.dataSource.updateShelfBook(shelfId, input)
  }

  deleteShelfBook(
    shelfId: string,
    shelfBookId: string
  ): Promise<Result<null>> {
    return this.dataSource.deleteShelfBook(shelfId, shelfBookId)
  }

  getShelfSummary(): Promise<Result<ShelfSummary>> {
    return this.dataSource.getShelfSummary()
  }

  getBranchOptions(): Promise<Result<ShelfBranchOption[]>> {
    return this.dataSource.getBranchOptions()
  }

  getLocationOptions(): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.getLocationOptions()
  }

  addLocationStep(label: string): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.addLocationStep(label)
  }

  updateLocationStep(
    stepId: string,
    label: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.updateLocationStep(stepId, label)
  }

  deleteLocationStep(stepId: string): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.deleteLocationStep(stepId)
  }

  addLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.addLocationValue(stepId, value)
  }

  updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.updateLocationValue(stepId, currentValue, value)
  }

  deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<Result<ShelfLocationOptions>> {
    return this.dataSource.deleteLocationValue(stepId, value)
  }

  createShelf(input: CreateShelfInput): Promise<Result<Shelf>> {
    return this.dataSource.createShelf(input)
  }

  updateShelf(input: UpdateShelfInput): Promise<Result<Shelf>> {
    return this.dataSource.updateShelf(input)
  }

  deleteShelf(shelfId: string): Promise<Result<null>> {
    return this.dataSource.deleteShelf(shelfId)
  }
}
