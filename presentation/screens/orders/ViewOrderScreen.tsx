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
import { TooltipProvider } from "@/components/ui/tooltip"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { OrderDetailHeader } from "@/presentation/components/orders/OrderDetailHeader"
import { OrderItemsTable } from "@/presentation/components/orders/OrderItemsTable"
import { OrderLocationSection } from "@/presentation/components/orders/OrderLocationSection"
import { OrderSummaryCards } from "@/presentation/components/orders/OrderSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useOrderDetailViewModel } from "@/presentation/viewmodels/orders/useOrderDetailViewModel"

type ViewOrderScreenProps = {
  orderId: string
  getOrdersUseCase: GetOrdersUseCase
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
          <Skeleton key={index} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="min-h-64 rounded-lg" />
    </div>
  )
}

export function ViewOrderScreen({ orderId, getOrdersUseCase }: ViewOrderScreenProps) {
  const router = useRouter()
  const viewModel = useOrderDetailViewModel(orderId, getOrdersUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: state.order?.supplierName ?? "Order Details" },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Order not found</CardTitle>
              <CardDescription>
                This order may have been removed or the link is invalid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
                <ArrowLeftIcon />
                Back to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Order unavailable</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                Retry
              </Button>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.order ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </div>

          <OrderDetailHeader
            order={state.order}
            onEdit={() => router.push(`/dashboard/orders/${state.order?.id}/edit`)}
          />

          <OrderSummaryCards order={state.order} />

          <OrderLocationSection order={state.order} />

          {state.order.notes ? (
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{state.order.notes}</p>
              </CardContent>
            </Card>
          ) : null}

          <TooltipProvider>
            <OrderItemsTable
              items={state.order.items}
              onView={(item) => router.push(`/dashboard/books/${item.bookId}`)}
            />
          </TooltipProvider>
        </div>
      ) : null}
    </>
  )
}
