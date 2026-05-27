"use client"

import { useState } from "react"
import { GitMergeIcon, PlusIcon, RefreshCwIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Category } from "@/domain/entities/category/Category"
import type { GetCategoriesUseCase } from "@/domain/usecases/categories/GetCategoriesUseCase"
import { CategoriesFilters } from "@/presentation/components/categories/CategoriesFilters"
import { CategoriesTable } from "@/presentation/components/categories/CategoriesTable"
import { ConcatCategoryDialog } from "@/presentation/components/categories/ConcatCategoryDialog"
import { CategoryFormDialog } from "@/presentation/components/categories/CategoryFormDialog"
import { CategorySummaryCards } from "@/presentation/components/categories/CategorySummaryCards"
import { useCategoriesViewModel } from "@/presentation/viewmodels/categories/useCategoriesViewModel"

type CategoriesScreenProps = {
  getCategoriesUseCase: GetCategoriesUseCase
}

function LoadingCategoriesScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function CategoriesScreen({
  getCategoriesUseCase,
}: CategoriesScreenProps) {
  const viewModel = useCategoriesViewModel(getCategoriesUseCase)
  const { state } = viewModel
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)

  const handleConfirmDelete = () => {
    if (!deleteCategory) return
    void (async () => {
      await viewModel.deleteCategory(deleteCategory.id)
      setDeleteCategory(null)
    })()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbPage>Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingCategoriesScreen /> : null}

        {state.error && !state.isReady ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Categories unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isReady ? (
          <TooltipProvider>
            <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
              <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-normal">
                    Categories
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Organize books into clear categories.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={viewModel.openConcatDialog}>
                    <GitMergeIcon />
                    Concat Category
                  </Button>
                  <Button onClick={viewModel.openCreateDialog}>
                    <PlusIcon />
                    Add Category
                  </Button>
                </div>
              </section>

              <CategorySummaryCards categories={state.categories} />

              <CategoriesFilters
                searchQuery={state.searchQuery}
                statusFilter={state.statusFilter}
                onSearchQueryChange={viewModel.setSearchQuery}
                onStatusFilterChange={viewModel.setStatusFilter}
              />

              {state.error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {state.error}
                </div>
              ) : null}

              <CategoriesTable
                categories={state.filteredCategories}
                onEdit={viewModel.openEditDialog}
                onDelete={(category) => setDeleteCategory(category)}
              />
            </div>
          </TooltipProvider>
        ) : null}

        <CategoryFormDialog
          open={state.isFormOpen}
          mode={state.formMode === "edit" ? "edit" : "create"}
          form={viewModel.form}
          isSaving={state.isSaving}
          error={state.formError}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              viewModel.closeFormDialog()
            }
          }}
          onSubmit={(values) => {
            void viewModel.saveCategory(values)
          }}
        />

        <ConcatCategoryDialog
          open={state.isConcatOpen}
          categories={state.categories}
          form={viewModel.concatForm}
          isSaving={state.isConcating}
          error={state.concatError}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              viewModel.closeConcatDialog()
            }
          }}
          onSubmit={(values) => {
            void viewModel.concatCategories(values)
          }}
        />

        <Dialog
          open={deleteCategory !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeleteCategory(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{deleteCategory?.name}
                &rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCategory(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={state.isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
