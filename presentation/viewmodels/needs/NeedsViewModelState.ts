export type AsyncStatus = "idle" | "loading" | "success" | "error"

export type NeedsViewModelState = {
  needsStatus: AsyncStatus
  needsError: string | null
  summary: import("@/domain/entities/need/Need").NeedSummary | null
  summaryStatus: AsyncStatus
  searchQuery: string
  categoryFilter: import("@/presentation/components/needs/NeedsFilters").NeedCategoryFilter
  branchFilter: import("@/presentation/components/needs/NeedsFilters").NeedBranchFilter
  priorityFilter: import("@/presentation/components/needs/NeedsFilters").NeedPriorityFilter
  statusFilter: import("@/presentation/components/needs/NeedsFilters").NeedStatusFilter
  dateFrom: string | null
  dateTo: string | null
  filteredNeeds: import("@/domain/entities/need/Need").NeedListItem[]
  branchOptions: Array<{ id: string; name: string }>
  showBranchFilter: boolean
  deleteNeedDialog: { needId: string; needName: string } | null
  rejectNeedDialog: { needId: string; needName: string } | null
  rejectReason: string
  deleteNeedError: string | null
  rejectNeedError: string | null
  isDeletingNeed: boolean
  isRejectingNeed: boolean
  isApprovingNeed: boolean
  isLoading: boolean
  isReady: boolean
}
