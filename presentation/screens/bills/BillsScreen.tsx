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
import type { Bill } from "@/domain/entities/bill/Bill"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { BillsFilters } from "@/presentation/components/bills/BillsFilters"
import { BillsTable } from "@/presentation/components/bills/BillsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useBillsViewModel } from "@/presentation/viewmodels/bills/useBillsViewModel"

type BillsScreenProps = {
  authUseCase: AuthUseCase
  getBillsUseCase: GetBillsUseCase
}

function LoadingBillsScreen() {
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

export function BillsScreen({ authUseCase, getBillsUseCase }: BillsScreenProps) {
  const router = useRouter()
  const viewModel = useBillsViewModel(authUseCase, getBillsUseCase)
  const { state } = viewModel
  const { t } = useTranslation()
  const [deleteBill, setDeleteBill] = useState<Bill | null>(null)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.bills") },
  ])

  const handleConfirmDelete = () => {
    if (!deleteBill) return
    void (async () => {
      const deleted = await viewModel.deleteBill(deleteBill.id)
      if (deleted) {
        toast.success(t("bills.deleteSuccess"))
      }
      setDeleteBill(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingBillsScreen /> : null}

      {state.error && !state.isReady ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("bills.unavailable")}</CardTitle>
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
                <h1 className="text-2xl font-bold tracking-normal">{t("bills.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("bills.subtitle")}</p>
              </div>
              <Button onClick={() => router.push("/dashboard/bills/create")}>
                <PlusIcon />
                {t("bills.addBill")}
              </Button>
            </section>

            <BillsFilters
              searchQuery={state.filters.searchQuery}
              branchFilter={state.filters.branchFilter}
              addedByFilter={state.filters.addedByFilter}
              dateFrom={state.filters.dateFrom}
              dateTo={state.filters.dateTo}
              branchFilterOptions={state.branchFilterOptions}
              addedByFilterOptions={state.addedByFilterOptions}
              showBranchFilter={state.showBranchFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onBranchFilterChange={viewModel.setBranchFilter}
              onAddedByFilterChange={viewModel.setAddedByFilter}
              onDateFromChange={viewModel.setDateFrom}
              onDateToChange={viewModel.setDateTo}
            />

            <BillsTable
              bills={state.filteredBills}
              showBranchColumn={state.showBranchColumn}
              onView={(bill) => router.push(`/dashboard/bills/${bill.id}`)}
              onEdit={(bill) => router.push(`/dashboard/bills/${bill.id}/edit`)}
              onDelete={(bill) => setDeleteBill(bill)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={deleteBill !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteBill(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bills.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("bills.deleteDialog.description", {
                companyName: deleteBill?.companyName ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBill(null)}>
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
