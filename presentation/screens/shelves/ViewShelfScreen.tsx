"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlusIcon, RefreshCwIcon } from "lucide-react"

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
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import { ShelfBookDeleteDialog } from "@/presentation/components/shelves/ShelfBookDeleteDialog"
import { ShelfBooksFilters } from "@/presentation/components/shelves/ShelfBooksFilters"
import { ShelfBooksTable } from "@/presentation/components/shelves/ShelfBooksTable"
import { ShelfDetailOverview } from "@/presentation/components/shelves/ShelfDetailOverview"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useViewShelfViewModel } from "@/presentation/viewmodels/shelves/useViewShelfViewModel"

type ViewShelfScreenProps = {
  shelfId: string
  authUseCase: AuthUseCase
  shelfManagementUseCase: ShelfManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="min-h-64 rounded-lg" />
    </div>
  )
}

export function ViewShelfScreen({
  shelfId,
  authUseCase,
  shelfManagementUseCase,
}: ViewShelfScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useViewShelfViewModel(
    shelfId,
    authUseCase,
    shelfManagementUseCase
  )
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.shelves"), href: dashboardPaths.shelves.list },
    { label: state.shelf?.name ?? t("shelves.viewBreadcrumbFallback") },
  ])

  const goBack = () => router.push(dashboardPaths.shelves.list)

  return (
    <TooltipProvider>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("shelves.view.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("shelves.view.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("shelves.view.backToShelves")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("shelves.view.unavailableTitle")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.shelf ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("shelves.view.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("shelves.view.descriptionWithName", {
                  name: state.shelf.name,
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void viewModel.reload()}
              >
                <RefreshCwIcon />
                {t("common.refresh")}
              </Button>
              <Button variant="outline" size="sm" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  router.push(dashboardPaths.shelves.shelfBook.add(shelfId))
                }
              >
                <PlusIcon />
                {t("shelves.view.addBook")}
              </Button>
            </div>
          </div>

          <ShelfDetailOverview
            shelf={state.shelf}
            showBranchField={state.showBranchField}
            onEdit={() => router.push(dashboardPaths.shelves.edit(shelfId))}
          />

          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t("shelves.filters.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShelfBooksFilters
                searchQuery={state.searchQuery}
                categoryFilter={state.categoryFilter}
                languageFilter={state.languageFilter}
                categoryOptions={state.categoryOptions}
                languageOptions={state.languageOptions}
                onSearchQueryChange={viewModel.setSearchQuery}
                onCategoryFilterChange={viewModel.setCategoryFilter}
                onLanguageFilterChange={viewModel.setLanguageFilter}
              />
            </CardContent>
          </Card>

          {state.booksError ? (
            <Card className="rounded-lg border-destructive/40">
              <CardContent className="py-4">
                <p className="text-sm text-destructive">{state.booksError}</p>
              </CardContent>
            </Card>
          ) : null}

          <ShelfBooksTable
            books={state.filteredBooks}
            isLoading={state.isBooksLoading}
            onView={(book) =>
              router.push(
                dashboardPaths.shelves.shelfBook.detail(shelfId, book.id)
              )
            }
            onEdit={(book) =>
              router.push(
                dashboardPaths.shelves.shelfBook.edit(shelfId, book.id)
              )
            }
            onDelete={(book) =>
              viewModel.openDeleteShelfBookDialog(book.id, book.title)
            }
          />

          <ShelfBookDeleteDialog
            open={state.deleteShelfBookDialog !== null}
            bookTitle={state.deleteShelfBookDialog?.bookTitle ?? ""}
            error={state.deleteShelfBookError}
            isDeleting={state.isDeletingShelfBook}
            onClose={viewModel.closeDeleteShelfBookDialog}
            onConfirm={() => void viewModel.confirmDeleteShelfBook()}
          />
        </div>
      ) : null}
    </TooltipProvider>
  )
}
