import type { GroupBookOption, GroupBranchOption, GroupStaffOption } from "@/domain/repositories/GroupRepository"

export type CreateGroupStatus = "loading" | "ready" | "saving" | "saved"

export type CreateGroupViewModelState = {
  status: CreateGroupStatus
  bookOptions: GroupBookOption[]
  staffOptions: GroupStaffOption[]
  branchOptions: GroupBranchOption[]
  showBranchField: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}
