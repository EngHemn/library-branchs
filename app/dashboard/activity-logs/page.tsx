"use client"

import { getActivityLogsUseCase } from "@/app/dashboard/activity-logs/activityLogsDependencies"
import { ActivityLogsScreen } from "@/presentation/screens/activityLogs/ActivityLogsScreen"

export default function ActivityLogsPage() {
  return <ActivityLogsScreen getActivityLogsUseCase={getActivityLogsUseCase} />
}
