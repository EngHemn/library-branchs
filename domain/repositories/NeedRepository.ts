import type {
  NeedDetail,
  NeedListItem,
  NeedSummary,
} from "@/domain/entities/need/Need"
import type { NeedCategory } from "@/domain/entities/need/NeedCategory"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"
import type { Result } from "@/domain/result/Result"

export type NeedBranchOption = {
  id: string
  name: string
}

export type NeedRequestedByOption = {
  id: string
  name: string
}

export type CreateNeedInput = {
  name: string
  category: NeedCategory
  description: string
  quantity: number
  priority: NeedPriority
  branchId: string
  requestedBy: string
  requestedById: string
  notes: string
  attachmentUrl?: string | null
  submitAs: "draft" | "pending"
}

export type UpdateNeedInput = CreateNeedInput & {
  id: string
  status?: NeedStatus
}

export interface NeedRepository {
  getNeeds(): Promise<Result<NeedListItem[]>>
  getNeedById(id: string): Promise<Result<NeedDetail | null>>
  getNeedSummary(): Promise<Result<NeedSummary>>
  getBranchOptions(): Promise<Result<NeedBranchOption[]>>
  getRequestedByOptions(): Promise<Result<NeedRequestedByOption[]>>
  createNeed(input: CreateNeedInput): Promise<Result<NeedDetail>>
  updateNeed(input: UpdateNeedInput): Promise<Result<NeedDetail>>
  deleteNeed(id: string): Promise<Result<null>>
  approveNeed(id: string, performedBy: string): Promise<Result<NeedDetail>>
  rejectNeed(
    id: string,
    performedBy: string,
    reason?: string
  ): Promise<Result<NeedDetail>>
}
