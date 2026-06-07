import type {
  NeedDetail,
  NeedListItem,
  NeedSummary,
} from "@/domain/entities/need/Need"
import type {
  CreateNeedInput,
  NeedBranchOption,
  NeedRepository,
  NeedRequestedByOption,
  UpdateNeedInput,
} from "@/domain/repositories/NeedRepository"
import type { Result } from "@/domain/result/Result"

export class NeedManagementUseCase {
  constructor(private readonly needRepository: NeedRepository) {}

  getNeeds(): Promise<Result<NeedListItem[]>> {
    return this.needRepository.getNeeds()
  }

  getNeedById(id: string): Promise<Result<NeedDetail | null>> {
    return this.needRepository.getNeedById(id)
  }

  getNeedSummary(): Promise<Result<NeedSummary>> {
    return this.needRepository.getNeedSummary()
  }

  getBranchOptions(): Promise<Result<NeedBranchOption[]>> {
    return this.needRepository.getBranchOptions()
  }

  getRequestedByOptions(): Promise<Result<NeedRequestedByOption[]>> {
    return this.needRepository.getRequestedByOptions()
  }

  createNeed(input: CreateNeedInput): Promise<Result<NeedDetail>> {
    return this.needRepository.createNeed(input)
  }

  updateNeed(input: UpdateNeedInput): Promise<Result<NeedDetail>> {
    return this.needRepository.updateNeed(input)
  }

  deleteNeed(id: string): Promise<Result<null>> {
    return this.needRepository.deleteNeed(id)
  }

  approveNeed(
    id: string,
    performedBy: string
  ): Promise<Result<NeedDetail>> {
    return this.needRepository.approveNeed(id, performedBy)
  }

  rejectNeed(
    id: string,
    performedBy: string,
    reason?: string
  ): Promise<Result<NeedDetail>> {
    return this.needRepository.rejectNeed(id, performedBy, reason)
  }
}
