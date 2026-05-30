import type {
  Branch,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type {
  ApproveBranchRequestInput,
  BranchManagementRepository,
  CreateBranchInput,
  ReplyToBranchRequestInput,
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

  getMainBranchRequestById(
    requestId: string
  ): Promise<Result<MainBranchRequest | null>> {
    return this.branchManagementRepository.getMainBranchRequestById(requestId)
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

  approveMainBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    return this.branchManagementRepository.approveMainBranchRequest(
      requestId,
      input
    )
  }

  rejectMainBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    return this.branchManagementRepository.rejectMainBranchRequest(
      requestId,
      input
    )
  }

  approveSubBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    return this.branchManagementRepository.approveSubBranchRequest(
      requestId,
      input
    )
  }

  rejectSubBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    return this.branchManagementRepository.rejectSubBranchRequest(
      requestId,
      input
    )
  }

  dismissMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.dismissMainBranchRequest(requestId)
  }

  dismissSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementRepository.dismissSubBranchRequest(requestId)
  }

  replyToMainBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<MainBranchRequest>> {
    return this.branchManagementRepository.replyToMainBranchRequest(
      requestId,
      input
    )
  }

  replyToSubBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<SubBranchRequest>> {
    return this.branchManagementRepository.replyToSubBranchRequest(
      requestId,
      input
    )
  }
}
