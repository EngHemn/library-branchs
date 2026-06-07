export const NEED_PRIORITIES = ["low", "medium", "high", "critical"] as const

export type NeedPriority = (typeof NEED_PRIORITIES)[number]

const needPriorityLabels: Record<NeedPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

export function getNeedPriorityLabel(priority: NeedPriority): string {
  return needPriorityLabels[priority]
}
