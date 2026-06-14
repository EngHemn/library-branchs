"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

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
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Order } from "@/domain/entities/order/Order"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { OrdersFilters } from "@/presentation/components/orders/OrdersFilters"
import { OrdersTable } from "@/presentation/components/orders/OrdersTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useOrdersViewModel } from "@/presentation/viewmodels/orders/useOrdersViewModel"

type OrdersScreenProps = {
  authUseCase: AuthUseCase
  getOrdersUseCase: GetOrdersUseCase
}

function LoadingOrdersScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function OrdersScreen({ authUseCase, getOrdersUseCase }: OrdersScreenProps) {
  const router = useRouter()
  const viewModel = useOrdersViewModel(authUseCase, getOrdersUseCase)
  const { state } = viewModel
  const { t } = useTranslation()
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.orders") },
  ])

  const handleConfirmDelete = () => {
    if (!deleteOrder) return
    void (async () => {
      const deleted = await viewModel.deleteOrder(deleteOrder.id)
      if (deleted) {
        toast.success(t("orders.deleteSuccess"))
      }
      setDeleteOrder(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingOrdersScreen /> : null}

      {state.error && !state.isReady ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("orders.unavailable")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                {t("common.retry")}
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
                <h1 className="text-2xl font-bold tracking-normal">{t("orders.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("orders.subtitle")}</p>
              </div>
              <Button onClick={() => router.push("/dashboard/orders/create")}>
                <PlusIcon />
                {t("orders.addOrder")}
              </Button>
            </section>

            <OrdersFilters
              searchQuery={state.filters.searchQuery}
              branchFilter={state.filters.branchFilter}
              statusFilter={state.filters.statusFilter}
              categoryFilter={state.filters.categoryFilter}
              authorFilter={state.filters.authorFilter}
              translatorFilter={state.filters.translatorFilter}
              dateFrom={state.filters.dateFrom}
              dateTo={state.filters.dateTo}
              branchFilterOptions={state.branchFilterOptions}
              categories={state.categories}
              authors={state.authors}
              translators={state.translators}
              showSubBranchFilter={state.showSubBranchFilter}
              showTranslatorFilter={state.showTranslatorFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onBranchFilterChange={viewModel.setBranchFilter}
              onStatusFilterChange={viewModel.setStatusFilter}
              onCategoryFilterChange={viewModel.setCategoryFilter}
              onAuthorFilterChange={viewModel.setAuthorFilter}
              onTranslatorFilterChange={viewModel.setTranslatorFilter}
              onDateFromChange={viewModel.setDateFrom}
              onDateToChange={viewModel.setDateTo}
              onClearFilters={viewModel.clearFilters}
            />

            <OrdersTable
              orders={state.filteredOrders}
              showBranchColumn={state.showBranchColumn}
              onView={(order) => router.push(`/dashboard/orders/${order.id}`)}
              onEdit={(order) => router.push(`/dashboard/orders/${order.id}/edit`)}
              onDelete={(order) => setDeleteOrder(order)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={deleteOrder !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteOrder(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orders.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("orders.deleteDialog.description", {
                supplierName: deleteOrder?.supplierName ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOrder(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={state.isDeleting}
            >
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
