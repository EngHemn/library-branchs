export const NEED_STATUSES = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "ordered",
  "received",
  "completed",
] as const

export type NeedStatus = (typeof NEED_STATUSES)[number]

const needStatusLabels: Record<NeedStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  ordered: "Ordered",
  received: "Received",
  completed: "Completed",
}

export function getNeedStatusLabel(status: NeedStatus): string {
  return needStatusLabels[status]
}
