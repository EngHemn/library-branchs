import type { ActivityLogFakeDataSource } from "@/data/datasources/ActivityLogFakeDataSource"
import type { ActivityLogsBundle } from "@/domain/entities/activity-log/ActivityLog"
import type { ActivityLogRepository } from "@/domain/repositories/ActivityLogRepository"
import type { Result } from "@/domain/result/Result"

export class ActivityLogRepositoryImpl implements ActivityLogRepository {
  constructor(private readonly dataSource: ActivityLogFakeDataSource) {}

  getActivityLogs(): Promise<Result<ActivityLogsBundle>> {
    return this.dataSource.getActivityLogs()
  }
}
