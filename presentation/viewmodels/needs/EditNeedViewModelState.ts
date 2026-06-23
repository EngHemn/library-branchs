export type EditNeedStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

export type EditNeedViewModelState = {
  status: EditNeedStatus
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  branchOptions: import("@/domain/repositories/NeedRepository").NeedBranchOption[]
  requestedByOptions: import("@/domain/repositories/NeedRepository").NeedRequestedByOption[]
  showBranchField: boolean
}
