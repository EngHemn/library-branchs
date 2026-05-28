"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import { CreateStockFormFields } from "@/presentation/components/stock/StockFormFields"
import { useCreateStockViewModel } from "@/presentation/viewmodels/stock/useCreateStockViewModel"

type CreateStockScreenProps = {
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
          {Array.from({ length: 5 }).map((_, index) => (
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

export function CreateStockScreen({ stockUseCase }: CreateStockScreenProps) {
  const router = useRouter()
  const viewModel = useCreateStockViewModel(stockUseCase)
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
                  <BreadcrumbPage>Add Stock</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingState /> : null}

        {(state.isReady || state.isSaving || state.isSaved) ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex items-center justify-between pt-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">Add Stock</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a new stock record for a branch.
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
                    Stock created successfully.
                  </p>
                  <Button size="sm" variant="outline" onClick={goBack}>
                    Back to stock management
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {state.error ? (
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
                  Fill in the details to create a stock record.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateStockFormFields
                  form={form}
                  books={state.books}
                  branches={state.branches}
                  subBranches={state.subBranches}
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
                        <PlusIcon />
                      )}
                      {state.isSaving ? "Creating..." : "Create Stock"}
                    </Button>
                  </div>
                </CreateStockFormFields>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
