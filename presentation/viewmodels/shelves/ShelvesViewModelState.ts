import type { Shelf, ShelfSummary } from "@/domain/entities/shelf/Shelf"
import type { ShelfType } from "@/domain/entities/shelf/ShelfType"
import type { ShelfBranchFilter } from "@/presentation/components/shelves/ShelvesFilters"

export type AsyncStatus = "idle" | "loading" | "success" | "error"

export type ShelvesViewModelState = {
  isLoading: boolean
  shelvesStatus: AsyncStatus
  summaryStatus: AsyncStatus
  shelvesError: string | null
  summary: ShelfSummary | null
  shelves: Shelf[]
  filteredShelves: Shelf[]
  searchQuery: string
  branchFilter: ShelfBranchFilter
  shelfTypeFilter: "all" | ShelfType
  statusFilter: "all" | "active" | "inactive"
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter: boolean
  showBranchColumn: boolean
  isDeleting: boolean
  deleteShelfDialog: { shelfId: string; shelfName: string } | null
  deleteShelfError: string | null
}
