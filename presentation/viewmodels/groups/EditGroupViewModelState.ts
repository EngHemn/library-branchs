import type { GroupDetail } from "@/domain/entities/group/Group"
import type {
  GroupBookOption,
  GroupBranchOption,
  GroupStaffOption,
} from "@/domain/repositories/GroupRepository"

export type EditGroupStatus = "loading" | "ready" | "saving" | "saved" | "not_found" | "error"

export type EditGroupViewModelState = {
  status: EditGroupStatus
  group: GroupDetail | null
  bookOptions: GroupBookOption[]
  staffOptions: GroupStaffOption[]
  branchOptions: GroupBranchOption[]
  showBranchField: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  isNotFound: boolean
  isError: boolean
}
