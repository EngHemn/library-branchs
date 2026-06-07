import type { NeedCategory } from "@/domain/entities/need/NeedCategory"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { NeedStatus } from "@/domain/entities/need/NeedStatus"

export type NeedAttachment = {
  id: string
  name: string
  url: string
  type: "image" | "document"
  uploadedAt: string
}

export type NeedNote = {
  id: string
  author: string
  content: string
  createdAt: string
}

export type NeedActivityAction =
  | "created"
  | "updated"
  | "approved"
  | "rejected"
  | "completed"

export type NeedActivityEntry = {
  id: string
  action: NeedActivityAction
  description: string
  performedBy: string
  createdAt: string
}

export type NeedRequest = {
  id: string
  name: string
  category: NeedCategory
  description: string
  quantity: number
  priority: NeedPriority
  branchId: string
  branchName: string
  requestedBy: string
  requestedById: string
  notes: string
  status: NeedStatus
  attachments: NeedAttachment[]
  comments: NeedNote[]
  activityLog: NeedActivityEntry[]
  createdAt: string
  updatedAt: string
}

export type NeedListItem = {
  id: string
  name: string
  category: NeedCategory
  requestedBy: string
  branchId: string
  branchName: string
  quantity: number
  priority: NeedPriority
  status: NeedStatus
  requestDate: string
}

export type NeedDetail = NeedRequest

export type NeedSummary = {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  criticalRequests: number
}
