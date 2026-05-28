"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  Loader2Icon,
  RefreshCwIcon,
  SaveIcon,
  TagIcon,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import { EditStockFormFields } from "@/presentation/components/stock/StockFormFields"
import { useEditStockViewModel } from "@/presentation/viewmodels/stock/useEditStockViewModel"

type EditStockScreenProps = {
  stockId: string
  stockUseCase: StockUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card className="rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function EditStockScreen({ stockId, stockUseCase }: EditStockScreenProps) {
  const router = useRouter()
  const viewModel = useEditStockViewModel(stockId, stockUseCase)
  const { state, form } = viewModel

  const goBack = () => {
    router.push("/dashboard/stock")
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/stock">Stock</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Stock</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingState /> : null}

        {state.isNotFound ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Stock record not found</CardTitle>
                <CardDescription>
                  The stock record you are trying to edit does not exist.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to stock
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Unable to load stock</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back
                </Button>
                <Button onClick={() => router.refresh()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {(state.isReady || state.isSaving || state.isSaved) && state.stockRow ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex items-center justify-between pt-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">Edit Stock</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update stock settings for {state.stockRow.bookTitle}.
                </p>
              </div>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back
              </Button>
            </section>

            {state.isSaved ? (
              <Card className="rounded-lg border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CardContent className="flex items-center gap-3 py-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Stock updated successfully.
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {state.error && state.isReady ? (
              <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <CardContent className="py-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {state.error}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Stock Details</CardTitle>
                <CardDescription>
                  Branch: {state.stockRow.branchName}
                  {state.stockRow.subBranchName
                    ? ` / ${state.stockRow.subBranchName}`
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-5 rounded-xl border bg-linear-to-r from-slate-50 to-white p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {state.stockRow.bookCoverUrl ? (
                      <img
                        src={state.stockRow.bookCoverUrl}
                        alt={state.stockRow.bookTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Book Details
                    </p>
                    <p className="truncate text-base font-semibold text-slate-900">
                      {state.stockRow.bookTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">{state.stockRow.isbn}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        <TagIcon className="mr-1 h-3 w-3" />
                        {state.stockRow.category}
                      </Badge>
                      <Badge variant="outline">Language: N/A</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-md border bg-white px-3 py-2">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-sm font-semibold">{state.stockRow.currentStock}</p>
                  </div>
                  <div className="rounded-md border bg-white px-3 py-2">
                    <p className="text-xs text-muted-foreground">Reserved</p>
                    <p className="text-sm font-semibold">{state.stockRow.reservedStock}</p>
                  </div>
                  <div className="rounded-md border bg-white px-3 py-2">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-sm font-semibold">{state.stockRow.availableStock}</p>
                  </div>
                </div>
                </div>
                <EditStockFormFields
                  form={form}
                  disabled={state.isSaving || state.isSaved}
                  onSubmit={viewModel.save}
                >
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      disabled={state.isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={state.isSaving || state.isSaved}
                    >
                      {state.isSaving ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <SaveIcon />
                      )}
                      {state.isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </EditStockFormFields>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
