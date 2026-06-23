import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeNeeds } from "@/data/fake/fakeNeeds"
import { fakeStaff } from "@/data/fake/fakeStaff"
import { dispatchFakeNotification } from "@/data/fake/fakeNotifications"
import type {
  NeedDetail,
  NeedListItem,
  NeedSummary,
  NeedActivityEntry,
  NeedAttachment,
} from "@/domain/entities/need/Need"
import type {
  CreateNeedInput,
  NeedBranchOption,
  NeedRequestedByOption,
  UpdateNeedInput,
} from "@/domain/repositories/NeedRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getBranchName(branchId: string): string {
  return (
    fakeBranches.find((branch) => branch.id === branchId)?.branchName ??
    branchId
  )
}

function toListItem(need: NeedDetail): NeedListItem {
  return {
    id: need.id,
    name: need.name,
    category: need.category,
    requestedBy: need.requestedBy,
    branchId: need.branchId,
    branchName: need.branchName,
    quantity: need.quantity,
    priority: need.priority,
    status: need.status,
    requestDate: need.createdAt,
  }
}

function buildSummary(needs: NeedDetail[]): NeedSummary {
  return {
    totalRequests: needs.length,
    pendingRequests: needs.filter((need) => need.status === "pending").length,
    approvedRequests: needs.filter((need) => need.status === "approved").length,
    criticalRequests: needs.filter(
      (need) =>
        need.priority === "critical" &&
        !["completed", "rejected", "draft"].includes(need.status)
    ).length,
  }
}

function createActivityEntry(
  action: NeedActivityEntry["action"],
  description: string,
  performedBy: string
): NeedActivityEntry {
  return {
    id: `NDL-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    description,
    performedBy,
    createdAt: new Date().toISOString(),
  }
}

export class NeedFakeDataSource {
  private needs: NeedDetail[] = fakeNeeds.map((need) => ({ ...need }))

  async getNeeds(): Promise<Result<NeedListItem[]>> {
    await delay(300)
    return {
      success: true,
      data: this.needs.map(toListItem),
    }
  }

  async getNeedById(id: string): Promise<Result<NeedDetail | null>> {
    await delay(250)
    const need = this.needs.find((item) => item.id === id)
    return { success: true, data: need ? { ...need } : null }
  }

  async getNeedSummary(): Promise<Result<NeedSummary>> {
    await delay(200)
    return { success: true, data: buildSummary(this.needs) }
  }

  async getBranchOptions(): Promise<Result<NeedBranchOption[]>> {
    await delay(150)
    return {
      success: true,
      data: fakeBranches.map((branch) => ({
        id: branch.id,
        name: branch.branchName,
      })),
    }
  }

  async getRequestedByOptions(): Promise<Result<NeedRequestedByOption[]>> {
    await delay(150)
    return {
      success: true,
      data: fakeStaff.map((member) => ({
        id: member.id,
        name: member.staffName,
      })),
    }
  }

  async createNeed(input: CreateNeedInput): Promise<Result<NeedDetail>> {
    await delay(400)

    const id = `ND-${String(this.needs.length + 1).padStart(3, "0")}`
    const now = new Date().toISOString()
    const status = input.submitAs === "draft" ? "draft" : "pending"

    const attachments: NeedAttachment[] = input.attachmentUrl
      ? [
          {
            id: `NDA-${Date.now()}`,
            name: "attachment",
            url: input.attachmentUrl,
            type: input.attachmentUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)
              ? "image"
              : "document",
            uploadedAt: now,
          },
        ]
      : []

    const need: NeedDetail = {
      id,
      name: input.name,
      category: input.category,
      description: input.description,
      quantity: input.quantity,
      priority: input.priority,
      branchId: input.branchId,
      branchName: getBranchName(input.branchId),
      requestedBy: input.requestedBy,
      requestedById: input.requestedById,
      notes: input.notes,
      status,
      attachments,
      comments: input.notes
        ? [
            {
              id: `NDC-${Date.now()}`,
              author: input.requestedBy,
              content: input.notes,
              createdAt: now,
            },
          ]
        : [],
      activityLog: [
        createActivityEntry(
          "created",
          status === "draft"
            ? "Need request saved as draft."
            : "Need request submitted for review.",
          input.requestedBy
        ),
      ],
      createdAt: now,
      updatedAt: now,
    }

    this.needs = [need, ...this.needs]

    if (status === "pending") {
      dispatchFakeNotification({
        title: "New need request",
        message: `${need.name} requested at ${need.branchName} (${need.priority} priority).`,
        type: need.priority === "critical" ? "warning" : "info",
      })
    }

    return { success: true, data: { ...need } }
  }

  async updateNeed(input: UpdateNeedInput): Promise<Result<NeedDetail>> {
    await delay(350)
    const index = this.needs.findIndex((item) => item.id === input.id)

    if (index === -1) {
      return { success: false, error: `Need ${input.id} not found` }
    }

    const now = new Date().toISOString()
    const existing = this.needs[index]

    const attachments: NeedAttachment[] = input.attachmentUrl
      ? [
          {
            id: `NDA-${Date.now()}`,
            name: "attachment",
            url: input.attachmentUrl,
            type: input.attachmentUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)
              ? "image"
              : "document",
            uploadedAt: now,
          },
        ]
      : existing.attachments

    const updated: NeedDetail = {
      ...existing,
      name: input.name,
      category: input.category,
      description: input.description,
      quantity: input.quantity,
      priority: input.priority,
      branchId: input.branchId,
      branchName: getBranchName(input.branchId),
      requestedBy: input.requestedBy,
      requestedById: input.requestedById,
      notes: input.notes,
      status: input.status ?? existing.status,
      attachments,
      activityLog: [
        ...existing.activityLog,
        createActivityEntry(
          "updated",
          "Need request details updated.",
          input.requestedBy
        ),
      ],
      updatedAt: now,
    }

    this.needs[index] = updated
    return { success: true, data: { ...updated } }
  }

  async deleteNeed(id: string): Promise<Result<null>> {
    await delay(300)
    const exists = this.needs.some((item) => item.id === id)

    if (!exists) {
      return { success: false, error: `Need ${id} not found` }
    }

    this.needs = this.needs.filter((item) => item.id !== id)
    return { success: true, data: null }
  }

  async approveNeed(
    id: string,
    performedBy: string
  ): Promise<Result<NeedDetail>> {
    await delay(300)
    const index = this.needs.findIndex((item) => item.id === id)

    if (index === -1) {
      return { success: false, error: `Need ${id} not found` }
    }

    const now = new Date().toISOString()
    const existing = this.needs[index]

    const updated: NeedDetail = {
      ...existing,
      status: "approved",
      activityLog: [
        ...existing.activityLog,
        createActivityEntry("approved", "Request approved.", performedBy),
      ],
      updatedAt: now,
    }

    this.needs[index] = updated

    dispatchFakeNotification({
      title: "Need request approved",
      message: `"${updated.name}" at ${updated.branchName} has been approved.`,
      type: "success",
    })

    return { success: true, data: { ...updated } }
  }

  async rejectNeed(
    id: string,
    performedBy: string,
    reason?: string
  ): Promise<Result<NeedDetail>> {
    await delay(300)
    const index = this.needs.findIndex((item) => item.id === id)

    if (index === -1) {
      return { success: false, error: `Need ${id} not found` }
    }

    const now = new Date().toISOString()
    const existing = this.needs[index]

    const updated: NeedDetail = {
      ...existing,
      status: "rejected",
      comments: reason
        ? [
            ...existing.comments,
            {
              id: `NDC-${Date.now()}`,
              author: performedBy,
              content: reason,
              createdAt: now,
            },
          ]
        : existing.comments,
      activityLog: [
        ...existing.activityLog,
        createActivityEntry(
          "rejected",
          reason ? `Request rejected: ${reason}` : "Request rejected.",
          performedBy
        ),
      ],
      updatedAt: now,
    }

    this.needs[index] = updated

    dispatchFakeNotification({
      title: "Need request rejected",
      message: `"${updated.name}" at ${updated.branchName} was rejected.`,
      type: "warning",
    })

    return { success: true, data: { ...updated } }
  }
}
