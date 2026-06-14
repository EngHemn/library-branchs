import type { DashboardChartBar } from "@/domain/entities/dashboard/DashboardSummary"
import type { TranslationKey } from "@/presentation/i18n/messages"

type TranslateFn = (key: TranslationKey, params?: Record<string, string | number>) => string

const CHART_LABEL_KEYS: Record<string, TranslationKey> = {
  borrowed: "dashboard.bookingStatus.borrowed",
  reserved: "dashboard.bookingStatus.reserved",
  returned: "dashboard.bookingStatus.returned",
  overdue: "dashboard.bookingStatus.overdue",
  cancelled: "dashboard.bookingStatus.cancelled",
  inside: "dashboard.bookingType.inside",
  outside: "dashboard.bookingType.outside",
  available: "dashboard.bookStatus.available",
  unavailable: "dashboard.bookStatus.unavailable",
  manager: "dashboard.staffRole.manager",
  librarian: "dashboard.staffRole.librarian",
  assistant: "dashboard.staffRole.assistant",
  clerk: "dashboard.staffRole.clerk",
  security: "dashboard.staffRole.security",
  softwareEng: "dashboard.chartCategories.softwareEng",
  selfDev: "dashboard.chartCategories.selfDev",
  business: "dashboard.chartCategories.business",
  history: "dashboard.chartCategories.history",
  psychology: "dashboard.chartCategories.psychology",
  other: "dashboard.chartCategories.other",
  central: "dashboard.chartBranches.central",
  westEnd: "dashboard.chartBranches.westEnd",
  brookline: "dashboard.chartBranches.brookline",
  northside: "dashboard.chartBranches.northside",
  southGarden: "dashboard.chartBranches.southGarden",
}

export function localizeChartBars(
  t: TranslateFn,
  bars: DashboardChartBar[]
): DashboardChartBar[] {
  return bars.map((bar) => {
    if (!bar.key) {
      return bar
    }

    const translationKey = CHART_LABEL_KEYS[bar.key]
    return {
      ...bar,
      label: translationKey ? t(translationKey) : bar.label,
    }
  })
}
