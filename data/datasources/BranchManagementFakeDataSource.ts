import type {
  Branch,
  BranchRequestReply,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type {
  ApproveBranchRequestInput,
  CreateBranchInput,
  ReplyToBranchRequestInput,
  UpdateBranchInput,
} from "@/domain/repositories/BranchManagementRepository"
import type { Result } from "@/domain/result/Result"
import {
  fakeBranches,
  fakeMainBranchRequests,
  fakeSubBranchRequests,
} from "@/data/fake/fakeBranches"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class BranchManagementFakeDataSource {
  private branches: Branch[] = fakeBranches.map((branch) => ({ ...branch }))
  private mainBranchRequests: MainBranchRequest[] = fakeMainBranchRequests.map(
    (request) => ({ ...request })
  )
  private subBranchRequests: SubBranchRequest[] = fakeSubBranchRequests.map(
    (request) => ({ ...request })
  )

  async getBranches(): Promise<Result<Branch[]>> {
    await delay(350)

    return {
      success: true,
      data: this.branches.map((branch) => ({ ...branch })),
    }
  }

  async getMainBranchRequests(): Promise<Result<MainBranchRequest[]>> {
    await delay(250)

    return {
      success: true,
      data: this.mainBranchRequests.map((request) => ({ ...request })),
    }
  }

  async getMainBranchRequestById(
    requestId: string
  ): Promise<Result<MainBranchRequest | null>> {
    await delay(200)

    const request = this.mainBranchRequests.find((item) => item.id === requestId)

    return {
      success: true,
      data: request ? { ...request } : null,
    }
  }

  async getSubBranchRequests(): Promise<Result<SubBranchRequest[]>> {
    await delay(250)

    return {
      success: true,
      data: this.subBranchRequests.map((request) => ({ ...request })),
    }
  }

  async deleteBranch(branchId: string): Promise<Result<null>> {
    await delay(200)

    const branchExists = this.branches.some((branch) => branch.id === branchId)

    if (!branchExists) {
      return {
        success: false,
        error: "Branch could not be found.",
      }
    }

    this.branches = this.branches.filter((branch) => branch.id !== branchId)

    return {
      success: true,
      data: null,
    }
  }

  async getBranchById(branchId: string): Promise<Result<Branch | null>> {
    await delay(200)

    const branch = this.branches.find((item) => item.id === branchId)

    return {
      success: true,
      data: branch ? { ...branch } : null,
    }
  }

  async createBranch(input: CreateBranchInput): Promise<Result<Branch>> {
    await delay(300)

    const newId = `BR-${String(this.branches.length + 1).padStart(3, "0")}`

    const newBranch: Branch = {
      id: newId,
      branchName: input.branchName,
      type: input.type,
      email: input.email,
      adminName: input.adminName,
      parentBranch: input.parentBranch,
      address: input.address,
      phone: input.phone,
      latitude: input.latitude,
      longitude: input.longitude,
      staffCount: 0,
      bookCount: 0,
      status: "active",
      imageUrl: input.imageUrl ?? null,
    }

    this.branches = [...this.branches, newBranch]

    return {
      success: true,
      data: { ...newBranch },
    }
  }

  async updateBranch(
    branchId: string,
    input: UpdateBranchInput
  ): Promise<Result<Branch>> {
    await delay(300)

    const branch = this.branches.find((item) => item.id === branchId)

    if (!branch) {
      return {
        success: false,
        error: "Branch could not be found.",
      }
    }

    const updatedBranch: Branch = {
      ...branch,
      branchName: input.branchName,
      email: input.email,
      adminName: input.adminName,
      parentBranch: input.parentBranch,
      address: input.address,
      phone: input.phone,
      latitude: input.latitude,
      longitude: input.longitude,
      imageUrl: input.imageUrl ?? branch.imageUrl ?? null,
    }

    this.branches = this.branches.map((item) =>
      item.id === branchId ? updatedBranch : item
    )

    return {
      success: true,
      data: { ...updatedBranch },
    }
  }

  async toggleBranchStatus(branchId: string): Promise<Result<Branch>> {
    await delay(200)

    const branch = this.branches.find((item) => item.id === branchId)

    if (!branch) {
      return {
        success: false,
        error: "Branch could not be found.",
      }
    }

    const updatedBranch: Branch = {
      ...branch,
      status: branch.status === "active" ? "inactive" : "active",
    }

    this.branches = this.branches.map((item) =>
      item.id === branchId ? updatedBranch : item
    )

    return {
      success: true,
      data: { ...updatedBranch },
    }
  }

  async approveMainBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    await delay(300)

    const request = this.mainBranchRequests.find((item) => item.id === requestId)

    if (!request) {
      return {
        success: false,
        error: "Main branch request could not be found.",
      }
    }

    if (!request.address.trim()) {
      return {
        success: false,
        error: "Request address is required before approval.",
      }
    }

    if (request.latitude === null || request.longitude === null) {
      return {
        success: false,
        error: "Request location is required before approval.",
      }
    }

    if (input.password.trim().length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      }
    }

    const createResult = await this.createBranch({
      branchName: request.branchName,
      type: "main",
      email: request.email,
      adminName: request.adminName,
      parentBranch: null,
      address: request.address,
      phone: request.phone,
      latitude: request.latitude,
      longitude: request.longitude,
      password: input.password.trim(),
    })

    if (!createResult.success) {
      return createResult
    }

    const removeResult = this.removeMainBranchRequest(requestId)

    if (!removeResult.success) {
      return {
        success: false,
        error: removeResult.error,
      }
    }

    return createResult
  }

  async rejectMainBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    await delay(200)

    if (input?.message.trim()) {
      const replyResult = this.addMainBranchReply(requestId, input)

      if (!replyResult.success) {
        return {
          success: false,
          error: replyResult.error,
        }
      }
    }

    return this.removeMainBranchRequest(requestId)
  }

  async approveSubBranchRequest(
    requestId: string,
    input: ApproveBranchRequestInput
  ): Promise<Result<Branch>> {
    await delay(300)

    const request = this.subBranchRequests.find((item) => item.id === requestId)

    if (!request) {
      return {
        success: false,
        error: "Sub branch request could not be found.",
      }
    }

    const parentBranch = this.branches.find(
      (branch) =>
        branch.branchName === request.parentBranchName && branch.type === "main"
    )

    if (!parentBranch) {
      return {
        success: false,
        error: "Parent branch could not be found for this request.",
      }
    }

    if (!request.address.trim()) {
      return {
        success: false,
        error: "Request address is required before approval.",
      }
    }

    if (request.latitude === null || request.longitude === null) {
      return {
        success: false,
        error: "Request location is required before approval.",
      }
    }

    if (input.password.trim().length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      }
    }

    const createResult = await this.createBranch({
      branchName: request.branchName,
      type: "sub",
      email: request.email,
      adminName: request.adminName,
      parentBranch: parentBranch.branchName,
      address: request.address,
      phone: request.phone,
      latitude: request.latitude,
      longitude: request.longitude,
      password: input.password.trim(),
    })

    if (!createResult.success) {
      return createResult
    }

    const removeResult = this.removeSubBranchRequest(requestId)

    if (!removeResult.success) {
      return {
        success: false,
        error: removeResult.error,
      }
    }

    return createResult
  }

  async rejectSubBranchRequest(
    requestId: string,
    input?: ReplyToBranchRequestInput
  ): Promise<Result<null>> {
    await delay(200)

    if (input?.message.trim()) {
      const replyResult = this.addSubBranchReply(requestId, input)

      if (!replyResult.success) {
        return {
          success: false,
          error: replyResult.error,
        }
      }
    }

    return this.removeSubBranchRequest(requestId)
  }

  async dismissMainBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)
    return this.removeMainBranchRequest(requestId)
  }

  async dismissSubBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)
    return this.removeSubBranchRequest(requestId)
  }

  async replyToMainBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<MainBranchRequest>> {
    await delay(250)

    return this.addMainBranchReply(requestId, input)
  }

  async replyToSubBranchRequest(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Promise<Result<SubBranchRequest>> {
    await delay(250)

    return this.addSubBranchReply(requestId, input)
  }

  private createReply(input: ReplyToBranchRequestInput): BranchRequestReply {
    return {
      id: `RPL-${Date.now()}`,
      message: input.message.trim(),
      sentAt: new Date().toISOString(),
      sentBy: input.sentBy,
    }
  }

  private addMainBranchReply(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Result<MainBranchRequest> {
    const message = input.message.trim()

    if (!message) {
      return {
        success: false,
        error: "Reply message is required.",
      }
    }

    const requestIndex = this.mainBranchRequests.findIndex(
      (request) => request.id === requestId
    )

    if (requestIndex === -1) {
      return {
        success: false,
        error: "Main branch request could not be found.",
      }
    }

    const updatedRequest: MainBranchRequest = {
      ...this.mainBranchRequests[requestIndex],
      replies: [
        ...this.mainBranchRequests[requestIndex].replies,
        this.createReply(input),
      ],
    }

    this.mainBranchRequests = this.mainBranchRequests.map((request, index) =>
      index === requestIndex ? updatedRequest : request
    )

    return {
      success: true,
      data: { ...updatedRequest },
    }
  }

  private addSubBranchReply(
    requestId: string,
    input: ReplyToBranchRequestInput
  ): Result<SubBranchRequest> {
    const message = input.message.trim()

    if (!message) {
      return {
        success: false,
        error: "Reply message is required.",
      }
    }

    const requestIndex = this.subBranchRequests.findIndex(
      (request) => request.id === requestId
    )

    if (requestIndex === -1) {
      return {
        success: false,
        error: "Sub branch request could not be found.",
      }
    }

    const updatedRequest: SubBranchRequest = {
      ...this.subBranchRequests[requestIndex],
      replies: [
        ...this.subBranchRequests[requestIndex].replies,
        this.createReply(input),
      ],
    }

    this.subBranchRequests = this.subBranchRequests.map((request, index) =>
      index === requestIndex ? updatedRequest : request
    )

    return {
      success: true,
      data: { ...updatedRequest },
    }
  }

  private removeMainBranchRequest(requestId: string): Result<null> {
    const requestExists = this.mainBranchRequests.some(
      (request) => request.id === requestId
    )

    if (!requestExists) {
      return {
        success: false,
        error: "Main branch request could not be found.",
      }
    }

    this.mainBranchRequests = this.mainBranchRequests.filter(
      (request) => request.id !== requestId
    )

    return {
      success: true,
      data: null,
    }
  }

  private removeSubBranchRequest(requestId: string): Result<null> {
    const requestExists = this.subBranchRequests.some(
      (request) => request.id === requestId
    )

    if (!requestExists) {
      return {
        success: false,
        error: "Sub branch request could not be found.",
      }
    }

    this.subBranchRequests = this.subBranchRequests.filter(
      (request) => request.id !== requestId
    )

    return {
      success: true,
      data: null,
    }
  }
}
