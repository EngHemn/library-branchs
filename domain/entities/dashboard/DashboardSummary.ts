export type DashboardMetricTrend = "up" | "down" | "neutral"

export type DashboardMetric = {
  id: string
  label: string
  value: string
  change: string
  helperText: string
  trend: DashboardMetricTrend
}

export type DashboardTaskStatus = "pending" | "in-progress" | "done"

export type DashboardTask = {
  id: string
  title: string
  owner: string
  dueDate: string
  progress: number
  status: DashboardTaskStatus
}

export type DashboardActivityTone = "default" | "success" | "warning"

export type DashboardActivity = {
  id: string
  title: string
  description: string
  time: string
  tone: DashboardActivityTone
}

export type DashboardSummary = {
  metrics: DashboardMetric[]
  tasks: DashboardTask[]
  activities: DashboardActivity[]
}
