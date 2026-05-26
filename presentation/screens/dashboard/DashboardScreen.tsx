"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  Clock3Icon,
  RefreshCwIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  DashboardActivityTone,
  DashboardMetricTrend,
  DashboardTaskStatus,
} from "@/domain/entities/dashboard/DashboardSummary"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetDashboardSummaryUseCase } from "@/domain/usecases/dashboard/GetDashboardSummaryUseCase"
import { useDashboardViewModel } from "@/presentation/viewmodels/dashboard/useDashboardViewModel"

type DashboardScreenProps = {
  authUseCase: AuthUseCase
  getDashboardSummaryUseCase: GetDashboardSummaryUseCase
}

const taskStatusLabel: Record<DashboardTaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
}

const taskStatusVariant: Record<
  DashboardTaskStatus,
  "default" | "secondary" | "outline"
> = {
  pending: "outline",
  "in-progress": "secondary",
  done: "default",
}

const activityToneClassName: Record<DashboardActivityTone, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

function MetricIcon({ trend }: { trend: DashboardMetricTrend }) {
  if (trend === "up") {
    return <ArrowUpRightIcon className="size-4 text-emerald-600" />
  }

  if (trend === "down") {
    return <ArrowDownRightIcon className="size-4 text-emerald-600" />
  }

  return <ActivityIcon className="size-4 text-muted-foreground" />
}

function LoadingDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_360px]">
        <Skeleton className="min-h-72 rounded-lg" />
        <Skeleton className="min-h-72 rounded-lg" />
      </div>
    </div>
  )
}

export function DashboardScreen({
  authUseCase,
  getDashboardSummaryUseCase,
}: DashboardScreenProps) {
  const router = useRouter()
  const viewModel = useDashboardViewModel(
    authUseCase,
    getDashboardSummaryUseCase
  )
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  const user = state.user
  const summary = state.summary

  return (
    <SidebarProvider>
      <AppSidebar
        user={
          user
            ? {
                name: user.fullName,
                email: `${user.username}@liba.local`,
                avatar: "",
              }
            : undefined
        }
        onLogout={viewModel.logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading || state.isUnauthenticated ? (
          <LoadingDashboard />
        ) : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Dashboard unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={viewModel.reload}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isReady && user && summary ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome back, {user.fullName}. Here is the latest workspace
                  snapshot.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={viewModel.reload}>
                <RefreshCwIcon />
                Refresh
              </Button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summary.metrics.map((metric) => (
                <Card key={metric.id} className="rounded-lg">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardDescription>{metric.label}</CardDescription>
                    <MetricIcon trend={metric.trend} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      {metric.value}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {metric.change}
                      </span>
                      <span>{metric.helperText}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_360px]">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Priority Work</CardTitle>
                  <CardDescription>
                    Tasks that need attention from the workspace team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-36">Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>{task.owner}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={taskStatusVariant[task.status]}>
                              {taskStatusLabel[task.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Progress value={task.progress} />
                              <span className="w-8 text-right text-xs text-muted-foreground">
                                {task.progress}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Operational events from the last few hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className={`mt-1 size-2 rounded-full ${activityToneClassName[activity.tone]}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-medium">
                            {activity.title}
                          </p>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-lg">
                <CardHeader>
                  <BarChart3Icon className="size-5 text-muted-foreground" />
                  <CardTitle>Sales Pipeline</CardTitle>
                  <CardDescription>
                    Forecast accuracy is holding at 91%.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="rounded-lg">
                <CardHeader>
                  <Clock3Icon className="size-5 text-muted-foreground" />
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>
                    Support replies average 18 minutes today.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="rounded-lg">
                <CardHeader>
                  <CheckCircle2Icon className="size-5 text-muted-foreground" />
                  <CardTitle>Fulfillment</CardTitle>
                  <CardDescription>
                    96% of orders are on schedule.
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
