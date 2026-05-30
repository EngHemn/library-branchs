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
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { MemberBookingsTable } from "@/presentation/components/members/MemberBookingsTable"
import { MemberDetailsTab } from "@/presentation/components/members/MemberDetailsTab"
import { useBranchNameLookup } from "@/presentation/hooks/useBranchNameLookup"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useViewMemberViewModel } from "@/presentation/viewmodels/members/useViewMemberViewModel"

type ViewMemberScreenProps = {
  memberId: string
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
  memberManagementUseCase,
  branchManagementUseCase,
}: ViewMemberScreenProps) {
  const router = useRouter()
  const viewModel = useViewMemberViewModel(memberId, memberManagementUseCase)
  const branchNameToId = useBranchNameLookup(branchManagementUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Members", href: "/dashboard/members" },
    { label: state.member?.memberName ?? "Member Details" },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Member not found</CardTitle>
              <CardDescription>
                The member you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to members
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to members
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                Retry
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
                  View member profile, active bookings, and borrowing history.
                </p>
              </div>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back
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
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="active-bookings" className="gap-1.5">
                  <BookOpenIcon className="size-3.5" />
                  <span className="hidden sm:inline">Active Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="late-returns" className="gap-1.5">
                  <ClockIcon className="size-3.5" />
                  <span className="hidden sm:inline">Late Returns</span>
                </TabsTrigger>
                <TabsTrigger value="borrowing-history" className="gap-1.5">
                  <HistoryIcon className="size-3.5" />
                  <span className="hidden sm:inline">Borrowing History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <MemberDetailsTab
                  member={state.member}
                  branchNameToId={branchNameToId}
                />
              </TabsContent>

              <TabsContent value="active-bookings">
                <MemberBookingsTable
                  title="Active Bookings"
                  bookings={state.member.bookings.active}
                  emptyMessage="This member has no active bookings."
                />
              </TabsContent>

              <TabsContent value="late-returns">
                <MemberBookingsTable
                  title="Late Returns"
                  bookings={state.member.bookings.lateReturns}
                  emptyMessage="This member has no late returns."
                  showDaysOverdue
                />
              </TabsContent>

              <TabsContent value="borrowing-history">
                <MemberBookingsTable
                  title="Borrowing History"
                  bookings={state.member.bookings.history}
                  emptyMessage="This member has no borrowing history."
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
