"use client"

import Link from "next/link"
import {
  AlertTriangleIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardNeedsAlertsStatsProps = {
  needStats: DashboardSummary["needStats"]
}

const statCards: Array<{
  key: keyof DashboardSummary["needStats"]
  titleKey: TranslationKey
  icon: typeof ClipboardListIcon
  color: string
}> = [
  {
    key: "totalRequests",
    titleKey: "dashboard.needs.totalRequests",
    icon: ClipboardListIcon,
    color: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
  },
  {
    key: "pendingRequests",
    titleKey: "dashboard.needs.pendingRequests",
    icon: ClipboardListIcon,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
  {
    key: "approvedRequests",
    titleKey: "dashboard.needs.approvedRequests",
    icon: ClipboardListIcon,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "criticalRequests",
    titleKey: "dashboard.needs.criticalRequests",
    icon: AlertTriangleIcon,
    color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
  },
  {
    key: "lowStockBooks",
    titleKey: "dashboard.needs.lowStockBooks",
    icon: BookOpenIcon,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
  },
  {
    key: "outOfStockBooks",
    titleKey: "dashboard.needs.outOfStockBooks",
    icon: BookOpenIcon,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
  },
]

export function DashboardNeedsAlertsStats({
  needStats,
}: DashboardNeedsAlertsStatsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = needStats[card.key]

        return (
          <Card key={card.key} className="rounded-xl">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`flex items-center justify-center size-10 rounded-lg ${card.color}`}>
                <Icon className="size-4" />
              </span>
              <p className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
            </div>
            <CardTitle className="text-sm mt-2">{t(card.titleKey)}</CardTitle>
          </CardContent>
        </Card> 
        )
      })}
    </div>
  )
}

type DashboardAlertsSectionProps = {
  criticalNeedRequests: DashboardSummary["criticalNeedRequests"]
  lowStockBooksPreview: DashboardSummary["lowStockBooksPreview"]
}

function priorityBadgeClass(priority: string): string {
  const map: Record<NeedPriority, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-sky-100 text-sky-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  }
  return map[priority as NeedPriority] ?? "bg-muted text-muted-foreground"
}

const PRIORITY_KEYS: Record<NeedPriority, TranslationKey> = {
  low: "dashboard.needs.priority.low",
  medium: "dashboard.needs.priority.medium",
  high: "dashboard.needs.priority.high",
  critical: "dashboard.needs.priority.critical",
}

export function DashboardAlertsSection({
  criticalNeedRequests,
  lowStockBooksPreview,
}: DashboardAlertsSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("dashboard.needs.criticalSectionTitle")}</CardTitle>
          <CardDescription>
            {t("dashboard.needs.criticalSectionDescription")}{" "}
            <Link
              href={dashboardPaths.needs.list}
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("dashboard.needs.viewAllNeeds")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalNeedRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("dashboard.needs.noCriticalNeeds")}
            </p>
          ) : (
            criticalNeedRequests.map((need) => (
              <Link
                key={need.id}
                href={dashboardPaths.needs.detail(need.id)}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{need.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {need.branchName}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={priorityBadgeClass(need.priority)}
                >
                  {t(PRIORITY_KEYS[need.priority as NeedPriority])}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("dashboard.needs.lowStockSectionTitle")}</CardTitle>
          <CardDescription>
            {t("dashboard.needs.lowStockSectionDescription")}{" "}
            <Link
              href={dashboardPaths.alerts.lowStock}
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("dashboard.needs.viewAllAlerts")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowStockBooksPreview.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("dashboard.needs.noLowStockBooks")}
            </p>
          ) : (
            lowStockBooksPreview.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <p className="truncate text-sm font-medium">{book.bookTitle}</p>
                <div className="shrink-0 text-right text-xs">
                  <p className="font-medium tabular-nums">
                    {book.currentStock} / {book.minimumStock}
                  </p>
                  <p className="text-muted-foreground">{t("dashboard.needs.currentMin")}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
