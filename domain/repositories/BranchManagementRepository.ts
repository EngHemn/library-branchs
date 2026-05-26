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
}

export interface BranchManagementRepository {
  getBranches(): Promise<Result<Branch[]>>
  getBranchById(branchId: string): Promise<Result<Branch | null>>
  getMainBranchRequests(): Promise<Result<MainBranchRequest[]>>
  getSubBranchRequests(): Promise<Result<SubBranchRequest[]>>
  createBranch(input: CreateBranchInput): Promise<Result<Branch>>
  updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<Result<Branch>>
  deleteBranch(branchId: string): Promise<Result<null>>
  toggleBranchStatus(branchId: string): Promise<Result<Branch>>
  approveMainBranchRequest(requestId: string): Promise<Result<null>>
  rejectMainBranchRequest(requestId: string): Promise<Result<null>>
  approveSubBranchRequest(requestId: string): Promise<Result<null>>
  rejectSubBranchRequest(requestId: string): Promise<Result<null>>
}
