"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import { EventBranchBooksSheet } from "@/presentation/components/events/EventBranchBooksSheet"
import { EventDetailHeader } from "@/presentation/components/events/EventDetailHeader"
import { EventParticipatingBranchesTable } from "@/presentation/components/events/EventParticipatingBranchesTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useEventBranchBooksSheet } from "@/presentation/viewmodels/events/useEventBranchBooksSheet"
import { useEventDetailViewModel } from "@/presentation/viewmodels/events/useEventDetailViewModel"

type ViewEventScreenProps = {
  eventId: string
  getEventsUseCase: GetEventsUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <Skeleton className="min-h-64 rounded-lg" />
    </div>
  )
}

export function ViewEventScreen({
  eventId,
  getEventsUseCase,
}: ViewEventScreenProps) {
  const router = useRouter()
  const viewModel = useEventDetailViewModel(eventId, getEventsUseCase)
  const branchBooksSheet = useEventBranchBooksSheet(getEventsUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Event Management", href: dashboardPaths.events.list },
    { label: state.event?.name ?? "Event Details" },
  ])

  const goBack = () => router.push(dashboardPaths.events.list)

  const branchBooksSelection = branchBooksSheet.selection

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Event not found</CardTitle>
              <CardDescription>
                The event you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to events
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
                Back to events
              </Button>
              <Button onClick={viewModel.reload}>
                <RefreshCwIcon />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.event ? (
        <main className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="pt-4">
            <EventDetailHeader
              event={state.event}
              onBack={goBack}
              onEdit={() => router.push(dashboardPaths.events.edit(eventId))}
            />
          </section>

          <Card className="max-w-3xl rounded-lg">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {state.event.description}
              </p>
            </CardContent>
          </Card>

          <section>
            <EventParticipatingBranchesTable
              branches={state.event.branches}
              eventId={state.event.id}
              eventName={state.event.name}
              onViewBranchBooks={branchBooksSheet.open}
            />
          </section>

          {branchBooksSelection ? (
            <EventBranchBooksSheet
              isOpen={branchBooksSheet.isOpen}
              eventId={branchBooksSelection.eventId}
              eventName={branchBooksSelection.eventName}
              branchId={branchBooksSelection.branchId}
              branchName={branchBooksSelection.branchName}
              books={branchBooksSheet.books}
              booksStatus={branchBooksSheet.booksStatus}
              booksError={branchBooksSheet.booksError}
              searchQuery={branchBooksSheet.searchQuery}
              languageFilter={branchBooksSheet.languageFilter}
              categoryFilter={branchBooksSheet.categoryFilter}
              authorFilter={branchBooksSheet.authorFilter}
              translatorFilter={branchBooksSheet.translatorFilter}
              languages={branchBooksSheet.languages}
              categories={branchBooksSheet.categories}
              authors={branchBooksSheet.authors}
              translators={branchBooksSheet.translators}
              onOpenChange={branchBooksSheet.setIsOpen}
              onSearchQueryChange={branchBooksSheet.setSearchQuery}
              onLanguageFilterChange={branchBooksSheet.setLanguageFilter}
              onCategoryFilterChange={branchBooksSheet.setCategoryFilter}
              onAuthorFilterChange={branchBooksSheet.setAuthorFilter}
              onTranslatorFilterChange={branchBooksSheet.setTranslatorFilter}
              onResetFilters={branchBooksSheet.resetFilters}
            />
          ) : null}
        </main>
      ) : null}
    </>
  )
}
