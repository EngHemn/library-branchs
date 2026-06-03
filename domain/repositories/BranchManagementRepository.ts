import type {
  Branch,
  BranchType,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { Result } from "@/domain/result/Result"

export type CreateBranchInput = {
  branchName: string
  type: BranchType
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
  password: string
  imageUrl?: string | null
}

export type UpdateBranchInput = {
  branchName: string
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
  password?: string
  imageUrl?: string | null
}

export type ReplyToBranchRequestInput = {
  message: string
  sentBy: string
}

export type ApproveBranchRequestInput = {
  password: string
}

export interface BranchManagementRepository {
  getBranches(): Promise<Result<Branch[]>>
  getBranchById(branchId: string): Promise<Result<Branch | null>>
  getMainBranchRequests(): Promise<Result<MainBranchRequest[]>>
  getMainBranchRequestById(
    requestId: string
  ): Promise<Result<MainBranchRequest | null>>
  getSubBranchRequests(): Promise<Result<SubBranchRequest[]>>
  createBranch(input: CreateBranchInput): Promise<Result<Branch>>
  updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<Result<Branch>>
  deleteBranch(branchId: string): Promise<Result<null>>
  toggleBranchStatus(branchId: string): Promise<Result<Branch>>
  approveMainBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>>
  rejectMainBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>>
  approveSubBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>>
  rejectSubBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>>
  dismissMainBranchRequest(requestId: string): Promise<Result<null>>
  dismissSubBranchRequest(requestId: string): Promise<Result<null>>
  replyToMainBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<MainBranchRequest>>
  replyToSubBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<SubBranchRequest>>
}
