import type { BranchType } from "@/domain/entities/branch/Branch"
import type { ShelfLocationPart } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"

export type ShelfStatus = "active" | "inactive"

export type Shelf = {
  id: string
  name: string
  code: string
  shelfType: ShelfType
  branchId: string
  branchName: string
  branchType: BranchType
  locationParts: ShelfLocationPart[]
  capacity: number
  bookCount: number
  status: ShelfStatus
}

export type ShelfSummary = {
  totalShelves: number
  mainBranchShelves: number
  subBranchShelves: number
  activeShelves: number
}
