export type CreateNeedStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

export type CreateNeedViewModelState = {
  status: CreateNeedStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  branchOptions: import("@/domain/repositories/NeedRepository").NeedBranchOption[]
  requestedByOptions: import("@/domain/repositories/NeedRepository").NeedRequestedByOption[]
  showBranchField: boolean
}
