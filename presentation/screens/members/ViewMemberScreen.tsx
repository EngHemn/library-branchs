"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  ClockIcon,
  HistoryIcon,
  RefreshCwIcon,
  UserRoundIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MemberBookingsTable } from "@/presentation/components/members/MemberBookingsTable"
import { MemberDetailsTab } from "@/presentation/components/members/MemberDetailsTab"
import { useBranchNameLookup } from "@/presentation/hooks/useBranchNameLookup"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useViewMemberViewModel } from "@/presentation/viewmodels/members/useViewMemberViewModel"

type ViewMemberScreenProps = {
  memberId: string
  authUseCase: AuthUseCase
  memberManagementUseCase: MemberManagementUseCase
  branchManagementUseCase: BranchManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function ViewMemberScreen({
  memberId,
  authUseCase,
  memberManagementUseCase,
  branchManagementUseCase,
}: ViewMemberScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useViewMemberViewModel(
    memberId,
    authUseCase,
    memberManagementUseCase
  )
  const branchNameToId = useBranchNameLookup(branchManagementUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.members"), href: "/dashboard/members" },
    { label: state.member?.memberName ?? t("members.view.breadcrumbFallback") },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("members.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("members.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("members.backToMembers")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("common.somethingWentWrong")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("members.backToMembers")}
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.member ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">
                  {state.member.memberName}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("members.view.subtitle")}
                </p>
              </div>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
              </Button>
            </section>

            <Tabs
              defaultValue="details"
              value={state.activeTab}
              onValueChange={(value) =>
                viewModel.setActiveTab(value as typeof state.activeTab)
              }
              className="gap-4"
            >
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 sm:w-fit">
                <TabsTrigger value="details" className="gap-1.5">
                  <UserRoundIcon className="size-3.5" />
                  <span className="hidden sm:inline">
                    {t("members.view.tabs.details")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="active-bookings" className="gap-1.5">
                  <BookOpenIcon className="size-3.5" />
                  <span className="hidden sm:inline">
                    {t("members.view.tabs.activeBookings")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="late-returns" className="gap-1.5">
                  <ClockIcon className="size-3.5" />
                  <span className="hidden sm:inline">
                    {t("members.view.tabs.lateReturns")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="borrowing-history" className="gap-1.5">
                  <HistoryIcon className="size-3.5" />
                  <span className="hidden sm:inline">
                    {t("members.view.tabs.borrowingHistory")}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <MemberDetailsTab
                  member={state.member}
                  branchNameToId={branchNameToId}
                  showBranchesUsedSection={state.showBranchesUsedSection}
                />
              </TabsContent>

              <TabsContent value="active-bookings">
                <MemberBookingsTable
                  title={t("members.view.tabs.activeBookings")}
                  bookings={state.member.bookings.active}
                  emptyMessage={t("members.view.empty.activeBookings")}
                  showBranchColumn={state.showBranchColumn}
                />
              </TabsContent>

              <TabsContent value="late-returns">
                <MemberBookingsTable
                  title={t("members.view.tabs.lateReturns")}
                  bookings={state.member.bookings.lateReturns}
                  emptyMessage={t("members.view.empty.lateReturns")}
                  showBranchColumn={state.showBranchColumn}
                  showDaysOverdue
                />
              </TabsContent>

              <TabsContent value="borrowing-history">
                <MemberBookingsTable
                  title={t("members.view.tabs.borrowingHistory")}
                  bookings={state.member.bookings.history}
                  emptyMessage={t("members.view.empty.borrowingHistory")}
                  showBranchColumn={state.showBranchColumn}
                  showReturnedDate
                />
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      ) : null}
    </>
  )
}
