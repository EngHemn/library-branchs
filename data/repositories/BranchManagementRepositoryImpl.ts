import { BranchManagementFakeDataSource } from "@/data/datasources/BranchManagementFakeDataSource"
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

  getMainBranchRequestById(
    requestId: string
  ): Promise<Result<MainBranchRequest | null>> {
    return this.branchManagementFakeDataSource.getMainBranchRequestById(
      requestId
    )
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

  approveMainBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    return this.branchManagementFakeDataSource.approveMainBranchRequest(
      requestId,
      input
    )
  }

  rejectMainBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.rejectMainBranchRequest(
      requestId,
      input
    )
  }

  approveSubBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    return this.branchManagementFakeDataSource.approveSubBranchRequest(
      requestId,
      input
    )
  }

  rejectSubBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.rejectSubBranchRequest(
      requestId,
      input
    )
  }

  dismissMainBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.dismissMainBranchRequest(
      requestId
    )
  }

  dismissSubBranchRequest(requestId: string): Promise<Result<null>> {
    return this.branchManagementFakeDataSource.dismissSubBranchRequest(
      requestId
    )
  }

  replyToMainBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<MainBranchRequest>> {
    return this.branchManagementFakeDataSource.replyToMainBranchRequest(
      requestId,
      input
    )
  }

  replyToSubBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<SubBranchRequest>> {
    return this.branchManagementFakeDataSource.replyToSubBranchRequest(
      requestId,
      input
    )
  }
}
