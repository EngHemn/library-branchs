export type NeedDetailStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "not_found"

export type NeedDetailViewModelState = {
  status: NeedDetailStatus
  error: string | null
  need: import("@/domain/entities/need/Need").NeedDetail | null
  isLoading: boolean
  isReady: boolean
  isApproving: boolean
  isRejecting: boolean
  rejectNeedDialog: boolean
  rejectReason: string
  rejectError: string | null
}
