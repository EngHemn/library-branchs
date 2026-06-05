export type ActivityLogAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "sale"
  | "booking"
  | "stock_update"
  | "transfer"
  | "permission_change"
  | "export"
  | "import"

export type ActivityLog = {
  id: string
  action: ActivityLogAction
  description: string
  entityType: string
  entityId: string | null
  staffId: string
  staffName: string
  branchId: string
  branchName: string
  createdAt: string
  ipAddress: string
}

export type ActivityLogStaffOption = {
  id: string
  name: string
}

export type ActivityLogBranchOption = {
  id: string
  name: string
}

export type ActivityLogsBundle = {
  logs: ActivityLog[]
  staffOptions: ActivityLogStaffOption[]
  branchOptions: ActivityLogBranchOption[]
}
