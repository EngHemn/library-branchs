import { fakeActivityLogs } from "@/data/fake/fakeActivityLogs"
import type {
  ActivityLogBranchOption,
  ActivityLogsBundle,
  ActivityLogStaffOption,
} from "@/domain/entities/activity-log/ActivityLog"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function buildStaffOptions(): ActivityLogStaffOption[] {
  const seen = new Map<string, string>()

  for (const log of fakeActivityLogs) {
    if (!seen.has(log.staffId)) {
      seen.set(log.staffId, log.staffName)
    }
  }

  return Array.from(seen.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((first, second) => first.name.localeCompare(second.name))
}

function buildBranchOptions(): ActivityLogBranchOption[] {
  const seen = new Map<string, string>()

  for (const log of fakeActivityLogs) {
    if (!seen.has(log.branchId)) {
      seen.set(log.branchId, log.branchName)
    }
  }

  return Array.from(seen.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((first, second) => first.name.localeCompare(second.name))
}

export class ActivityLogFakeDataSource {
  async getActivityLogs(): Promise<Result<ActivityLogsBundle>> {
    try {
      await delay(450)

      return {
        success: true,
        data: {
          logs: [...fakeActivityLogs].sort(
            (first, second) =>
              new Date(second.createdAt).getTime() -
              new Date(first.createdAt).getTime()
          ),
          staffOptions: buildStaffOptions(),
          branchOptions: buildBranchOptions(),
        },
      }
    } catch {
      return {
        success: false,
        error: "Failed to load activity logs",
      }
    }
  }
}
