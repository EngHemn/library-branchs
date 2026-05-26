import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
import type {
  Branch,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type {
  BranchManagementRepository,
  CreateBranchInput,
  UpdateBranchInput,
} from "@/domain/repositories/BranchManagementRepository"
import type { Result } from "@/domain/result/Result"

export class BranchManagementRepositoryImpl implements BranchManagementRepository {
  constructor(
    private readonly branchManagementFakeDataSource: BranchManagementFakeDataSource
  ) {}

  getBranches(): Promise<Result<Branch[]>> {
    return this.branchManagementFakeDataSource.getBranches()
  }

  getBranchById(branchId: string): Promise<Result<Branch | null>> {
    return this.branchManagementFakeDataSource.getBranchById(branchId)
  }

  getMainBranchRequests(): Promise<Result<MainBranchRequest[]>> {
    return this.branchManagementFakeDataSource.getMainBranchRequests()
  }

  getSubBranchRequests(): Promise<Result<SubBranchRequest[]>> {
    return this.branchManagementFakeDataSource.getSubBranchRequests()
  }

  createBranch(input: CreateBranchInput): Promise<Result<Branch>> {
    return this.branchManagementFakeDataSource.createBranch(input)
  }

  updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<Result<Branch>> {
    return this.branchManagementFakeDataSource.updateBranch(branchId, input)
  }

  deleteBranch(branchId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.deleteBranch(branchId)
  }

  toggleBranchStatus(branchId: string): Promise<Result<Branch>> {
    return this.branchManagementFakeDataSource.toggleBranchStatus(branchId)
  }

  approveMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.approveMainBranchRequest(
      requestId
    )
  }

  rejectMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.rejectMainBranchRequest(
      requestId
    )
  }

  approveSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.approveSubBranchRequest(
      requestId
    )
  }

  rejectSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.rejectSubBranchRequest(requestId)
  }
}
