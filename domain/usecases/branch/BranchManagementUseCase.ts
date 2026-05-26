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

export class BranchManagementUseCase {
  constructor(
    private readonly branchManagementRepository: BranchManagementRepository
  ) {}

  getBranches(): Promise<Result<Branch[]>> {
    return this.branchManagementRepository.getBranches()
  }

  getBranchById(branchId: string): Promise<Result<Branch | null>> {
    return this.branchManagementRepository.getBranchById(branchId)
  }

  getMainBranchRequests(): Promise<Result<MainBranchRequest[]>> {
    return this.branchManagementRepository.getMainBranchRequests()
  }

  getSubBranchRequests(): Promise<Result<SubBranchRequest[]>> {
    return this.branchManagementRepository.getSubBranchRequests()
  }

  createBranch(input: CreateBranchInput): Promise<Result<Branch>> {
    return this.branchManagementRepository.createBranch(input)
  }

  updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<Result<Branch>> {
    return this.branchManagementRepository.updateBranch(branchId, input)
  }

  deleteBranch(branchId: string): Promise<Result<null>> {
    return this.branchManagementRepository.deleteBranch(branchId)
  }

  toggleBranchStatus(branchId: string): Promise<Result<Branch>> {
    return this.branchManagementRepository.toggleBranchStatus(branchId)
  }

  approveMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.approveMainBranchRequest(requestId)
  }

  rejectMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.rejectMainBranchRequest(requestId)
  }

  approveSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.approveSubBranchRequest(requestId)
  }

  rejectSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.rejectSubBranchRequest(requestId)
  }
}
