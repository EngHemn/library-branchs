import type { NeedFakeDataSource } from "@/data/datasources/NeedFakeDataSource"
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

export class NeedRepositoryImpl implements NeedRepository {
  constructor(private readonly dataSource: NeedFakeDataSource) {}

  getNeeds(): Promise<Result<NeedListItem[]>> {
    return this.dataSource.getNeeds()
  }

  getNeedById(id: string): Promise<Result<NeedDetail | null>> {
    return this.dataSource.getNeedById(id)
  }

  getNeedSummary(): Promise<Result<NeedSummary>> {
    return this.dataSource.getNeedSummary()
  }

  getBranchOptions(): Promise<Result<NeedBranchOption[]>> {
    return this.dataSource.getBranchOptions()
  }

  getRequestedByOptions(): Promise<Result<NeedRequestedByOption[]>> {
    return this.dataSource.getRequestedByOptions()
  }

  createNeed(input: CreateNeedInput): Promise<Result<NeedDetail>> {
    return this.dataSource.createNeed(input)
  }

  updateNeed(input: UpdateNeedInput): Promise<Result<NeedDetail>> {
    return this.dataSource.updateNeed(input)
  }

  deleteNeed(id: string): Promise<Result<null>> {
    return this.dataSource.deleteNeed(id)
  }

  approveNeed(id: string, performedBy: string): Promise<Result<NeedDetail>> {
    return this.dataSource.approveNeed(id, performedBy)
  }

  rejectNeed(
    id: string,
    performedBy: string,
    reason?: string
  ): Promise<Result<NeedDetail>> {
    return this.dataSource.rejectNeed(id, performedBy, reason)
  }
}
