import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"

export type EditShelfStatus = "loading" | "ready" | "saving" | "saved" | "error"

export type ShelfFormStep = 1 | 2 | 3

export type EditShelfViewModelState = {
  status: EditShelfStatus
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  error: string | null
  notFound: boolean
  currentStep: ShelfFormStep
  locationStepIndex: number
  branchOptions: Array<{ id: string; name: string }>
  canSelectBranch: boolean
  locationOptions: ShelfLocationOptions | null
  selectedBranchName: string
  locationManageError: string | null
  isManagingLocation: boolean
}
