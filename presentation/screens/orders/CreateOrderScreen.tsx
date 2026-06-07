"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { OrderFormFields } from "@/presentation/components/orders/OrderFormFields"
import { buildCreateHrefWithReturn } from "@/presentation/components/shared/DashboardEntityLink"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useCreateOrderViewModel } from "@/presentation/viewmodels/orders/useCreateOrderViewModel"

const CREATE_BOOK_PATH = "/dashboard/books/create"

type CreateOrderScreenProps = {
  authUseCase: AuthUseCase
  getOrdersUseCase: GetOrdersUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card className="rounded-lg">
        <CardContent className="space-y-6 py-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function CreateOrderScreen({
  authUseCase,
  getOrdersUseCase,
}: CreateOrderScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/orders"
  const currentPath = `/dashboard/orders/create?returnTo=${encodeURIComponent(returnTo)}`
  const createBookHref = buildCreateHrefWithReturn(CREATE_BOOK_PATH, currentPath)
  const viewModel = useCreateOrderViewModel(authUseCase, getOrdersUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Add Order" },
  ])

  const goBack = () => router.push(returnTo)

  useFormSubmitSuccess(state.isSaved, "Order created successfully.")

  if (state.isLoading) {
    return <LoadingState />
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Add Order</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a purchase order with supplier details and book items.
          </p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeftIcon />
          Back
        </Button>
      </section>

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
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Enter supplier information, dates, status, and books to order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderFormFields
            form={form}
            branchOptions={state.branchOptions}
            bookOptions={state.bookOptions}
            createBookHref={createBookHref}
            showBranchField={state.showBranchField}
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
              <Button type="submit" disabled={state.isSaving || state.isSaved}>
                {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                {state.isSaving ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </OrderFormFields>
        </CardContent>
      </Card>
    </div>
  )
}
