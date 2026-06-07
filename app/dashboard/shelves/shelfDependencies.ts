import { ShelfManagementFakeDataSource } from "@/data/datasources/ShelfManagementFakeDataSource"
import { ShelfManagementRepositoryImpl } from "@/data/repositories/ShelfManagementRepositoryImpl"
import { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"

const shelfManagementFakeDataSource = new ShelfManagementFakeDataSource()
const shelfManagementRepository = new ShelfManagementRepositoryImpl(
  shelfManagementFakeDataSource
)

export const shelfManagementUseCase = new ShelfManagementUseCase(
  shelfManagementRepository
)
