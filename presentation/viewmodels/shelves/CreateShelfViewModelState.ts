import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"

export type CreateShelfStatus = "loading" | "ready" | "saving" | "saved" | "error"

export type ShelfFormStep = 1 | 2 | 3

export type CreateShelfViewModelState = {
  status: CreateShelfStatus
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  error: string | null
  currentStep: ShelfFormStep
  locationStepIndex: number
  branchOptions: Array<{ id: string; name: string }>
  canSelectBranch: boolean
  locationOptions: ShelfLocationOptions | null
  selectedBranchName: string
  locationManageError: string | null
  isManagingLocation: boolean
}
