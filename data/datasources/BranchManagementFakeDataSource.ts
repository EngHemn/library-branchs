import type {
  Branch,
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import type {
  CreateBranchInput,
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

  async approveMainBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)

    return this.removeMainBranchRequest(requestId)
  }

  async rejectMainBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)

    return this.removeMainBranchRequest(requestId)
  }

  async approveSubBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)

    return this.removeSubBranchRequest(requestId)
  }

  async rejectSubBranchRequest(requestId: string): Promise<Result<null>> {
    await delay(200)

    return this.removeSubBranchRequest(requestId)
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
