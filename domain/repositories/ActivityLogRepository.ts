import type { ActivityLogsBundle } from "@/domain/entities/activity-log/ActivityLog"
import type { Result } from "@/domain/result/Result"

export interface ActivityLogRepository {
  getActivityLogs(): Promise<Result<ActivityLogsBundle>>
}
