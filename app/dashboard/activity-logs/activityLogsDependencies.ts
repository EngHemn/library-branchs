import { ActivityLogFakeDataSource } from "@/data/datasources/ActivityLogFakeDataSource"
import { ActivityLogRepositoryImpl } from "@/data/repositories/ActivityLogRepositoryImpl"
import { GetActivityLogsUseCase } from "@/domain/usecases/activityLogs/GetActivityLogsUseCase"

const activityLogFakeDataSource = new ActivityLogFakeDataSource()
const activityLogRepository = new ActivityLogRepositoryImpl(
  activityLogFakeDataSource
)

export const getActivityLogsUseCase = new GetActivityLogsUseCase(
  activityLogRepository
)
