import type { ActivityLogsBundle } from "@/domain/entities/activity-log/ActivityLog"
import type { ActivityLogRepository } from "@/domain/repositories/ActivityLogRepository"
import type { Result } from "@/domain/result/Result"

export class GetActivityLogsUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  execute(): Promise<Result<ActivityLogsBundle>> {
    return this.activityLogRepository.getActivityLogs()
  }
}
