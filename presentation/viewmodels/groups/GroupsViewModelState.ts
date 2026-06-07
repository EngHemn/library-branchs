import type { GroupListItem, GroupSummary } from "@/domain/entities/group/Group"
import type { GroupStatusFilter } from "@/presentation/components/groups/GroupsFilters"

export type AsyncStatus = "idle" | "loading" | "success" | "error"

export type GroupsViewModelState = {
  groups: GroupListItem[]
  groupsStatus: AsyncStatus
  groupsError: string | null
  summary: GroupSummary | null
  summaryStatus: AsyncStatus
  searchQuery: string
  statusFilter: GroupStatusFilter
  filteredGroups: GroupListItem[]
  deleteGroupDialog: { groupId: string; groupName: string } | null
  deleteGroupError: string | null
  isDeletingGroup: boolean
  isLoading: boolean
  isReady: boolean
}
