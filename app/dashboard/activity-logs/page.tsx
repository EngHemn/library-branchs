"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { getActivityLogsUseCase } from "@/app/dashboard/activity-logs/activityLogsDependencies"
import { ActivityLogsScreen } from "@/presentation/screens/activityLogs/ActivityLogsScreen"

export default function ActivityLogsPage() {
  return (
    <ActivityLogsScreen
      authUseCase={dashboardAuthUseCase}
      getActivityLogsUseCase={getActivityLogsUseCase}
    />
  )
}
