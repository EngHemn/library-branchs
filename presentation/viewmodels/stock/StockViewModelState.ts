"use client"

import type {
  StockRow,
  StockSummary,
} from "@/domain/entities/stock/Stock"
import type { StockMovement, MovementType } from "@/domain/entities/stock/StockMovement"

export type AsyncStatus = "idle" | "loading" | "success" | "error"

export type StockViewModelState = {
  stockRows: StockRow[]
  stockStatus: AsyncStatus
  stockError: string | null

  summary: StockSummary | null
  summaryStatus: AsyncStatus

  movements: StockMovement[]
  movementsStatus: AsyncStatus
  movementsError: string | null

  searchQuery: string
  selectedMainBranchId: string | null
  selectedSubBranchId: string | null
  selectedCategory: string | null
  showLowStock: boolean
  showOutOfStock: boolean

  movementSearchQuery: string
  movementTypeFilter: MovementType | null
  movementBranchFilter: string | null
  movementDateFrom: string | null
  movementDateTo: string | null
  movementUserFilter: string | null

  isAddStockDialogOpen: boolean
  isReduceStockDialogOpen: boolean
  isTransferDialogOpen: boolean
  selectedStockRow: StockRow | null

  isSubmitting: boolean
  submitError: string | null

  expandedStockGroupIds: string[]

  filteredStockRows: StockRow[]
  filteredMovements: StockMovement[]

  availableMainBranches: { id: string; name: string }[]
  availableSubBranches: { id: string; name: string }[]
  availableCategories: string[]
  availableUsers: string[]
  availableMovementBranches: { id: string; name: string }[]
}
