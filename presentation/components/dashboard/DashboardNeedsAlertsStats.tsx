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
import { getNeedPriorityLabel } from "@/domain/entities/need/NeedPriority"
import type { NeedPriority } from "@/domain/entities/need/NeedPriority"

type DashboardNeedsAlertsStatsProps = {
  needStats: DashboardSummary["needStats"]
}

const statCards = [
  {
    key: "totalRequests",
    title: "Total Need Requests",
    icon: ClipboardListIcon,
    color: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
  },
  {
    key: "pendingRequests",
    title: "Pending Requests",
    icon: ClipboardListIcon,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
  {
    key: "approvedRequests",
    title: "Approved Requests",
    icon: ClipboardListIcon,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "criticalRequests",
    title: "Critical Requests",
    icon: AlertTriangleIcon,
    color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
  },
  {
    key: "lowStockBooks",
    title: "Low Stock Books",
    icon: BookOpenIcon,
    color: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
  },
  {
    key: "outOfStockBooks",
    title: "Out Of Stock Books",
    icon: BookOpenIcon,
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
  },
] as const

export function DashboardNeedsAlertsStats({
  needStats,
}: DashboardNeedsAlertsStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = needStats[card.key]

        return (
          <Card key={card.key} className="rounded-xl">
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.color}`}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-sm">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums">
                {value.toLocaleString()}
              </p>
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

export function DashboardAlertsSection({
  criticalNeedRequests,
  lowStockBooksPreview,
}: DashboardAlertsSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Critical Need Requests</CardTitle>
          <CardDescription>
            High-priority requests requiring attention.{" "}
            <Link
              href={dashboardPaths.needs.list}
              className="text-primary underline-offset-4 hover:underline"
            >
              View all needs
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalNeedRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No critical need requests at this time.
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
                  {getNeedPriorityLabel(need.priority as NeedPriority)}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Low Stock Books</CardTitle>
          <CardDescription>
            Titles below minimum inventory threshold.{" "}
            <Link
              href={dashboardPaths.alerts.lowStock}
              className="text-primary underline-offset-4 hover:underline"
            >
              View all alerts
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowStockBooksPreview.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No low stock books at this time.
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
                  <p className="text-muted-foreground">current / min</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
