"use client"

import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import { EventSummaryCards } from "@/presentation/components/events/EventSummaryCards"
import { EventsFilters } from "@/presentation/components/events/EventsFilters"
import { EventBranchBooksSheet } from "@/presentation/components/events/EventBranchBooksSheet"
import { EventsTable } from "@/presentation/components/events/EventsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useEventsViewModel } from "@/presentation/viewmodels/events/useEventsViewModel"

type EventsScreenProps = {
  getEventsUseCase: GetEventsUseCase
}

function LoadingEventsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function EventsScreen({ getEventsUseCase }: EventsScreenProps) {
  const router = useRouter()
  const viewModel = useEventsViewModel(getEventsUseCase)
  const { state } = viewModel

  const summaryLoading =
    state.summaryStatus === "idle" || state.summaryStatus === "loading"

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Event Management" },
  ])

  if (state.isLoading) {
    return <LoadingEventsScreen />
  }

  if (state.eventsStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load events</CardTitle>
            <CardDescription>
              {state.eventsError ?? "Something went wrong. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => void viewModel.reload()}>
              <RefreshCwIcon />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const branchBooksSelection = state.branchBooksSelection

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Event Management
          </h1>
          <p className="text-sm text-muted-foreground">
            One event can run at a single branch or across many branches.
            Use the table to review each event; expand rows when multiple
            branches participate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void viewModel.reload()}
          >
            <RefreshCwIcon />
            Refresh
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => router.push(dashboardPaths.events.create)}
          >
            <PlusIcon />
            Add Event
          </Button>
        </div>
      </div>

      <EventSummaryCards summary={state.summary} isLoading={summaryLoading} />

      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsFilters
            searchQuery={state.searchQuery}
            onSearchQueryChange={viewModel.setSearchQuery}
            statusFilter={state.statusFilter}
            onStatusFilterChange={viewModel.setStatusFilter}
          />
        </CardContent>
      </Card>

      <TooltipProvider>
        <EventsTable
          events={state.filteredEvents}
          expandedEventIds={state.expandedEventIds}
          onToggleExpanded={viewModel.toggleEventExpanded}
          onViewBranchBooks={viewModel.openBranchBooks}
          onView={(event) => router.push(dashboardPaths.events.detail(event.id))}
          onEdit={(event) => router.push(dashboardPaths.events.edit(event.id))}
        />
      </TooltipProvider>

      {branchBooksSelection ? (
        <EventBranchBooksSheet
          isOpen={state.isBranchBooksSheetOpen}
          eventId={branchBooksSelection.eventId}
          eventName={branchBooksSelection.eventName}
          branchId={branchBooksSelection.branchId}
          branchName={branchBooksSelection.branchName}
          books={state.filteredBranchBooks}
          booksStatus={state.branchBooksStatus}
          booksError={state.branchBooksError}
          searchQuery={state.branchBooksSearchQuery}
          languageFilter={state.branchBooksLanguageFilter}
          categoryFilter={state.branchBooksCategoryFilter}
          authorFilter={state.branchBooksAuthorFilter}
          translatorFilter={state.branchBooksTranslatorFilter}
          languages={state.branchBooksLanguages}
          categories={state.branchBooksCategories}
          authors={state.branchBooksAuthors}
          translators={state.branchBooksTranslators}
          onOpenChange={viewModel.setBranchBooksSheetOpen}
          onSearchQueryChange={viewModel.setBranchBooksSearchQuery}
          onLanguageFilterChange={viewModel.setBranchBooksLanguageFilter}
          onCategoryFilterChange={viewModel.setBranchBooksCategoryFilter}
          onAuthorFilterChange={viewModel.setBranchBooksAuthorFilter}
          onTranslatorFilterChange={viewModel.setBranchBooksTranslatorFilter}
          onResetFilters={viewModel.resetBranchBooksFilters}
        />
      ) : null}
    </div>
  )
}
