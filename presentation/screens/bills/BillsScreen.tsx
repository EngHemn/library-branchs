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
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { BillsFilters } from "@/presentation/components/bills/BillsFilters"
import { BillsTable } from "@/presentation/components/bills/BillsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useBillsViewModel } from "@/presentation/viewmodels/bills/useBillsViewModel"

type BillsScreenProps = {
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

export function BillsScreen({ getBillsUseCase }: BillsScreenProps) {
  const router = useRouter()
  const viewModel = useBillsViewModel(getBillsUseCase)
  const { state } = viewModel
  const [deleteBill, setDeleteBill] = useState<Bill | null>(null)

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Bills" },
  ])

  const handleConfirmDelete = () => {
    if (!deleteBill) return
    void (async () => {
      const deleted = await viewModel.deleteBill(deleteBill.id)
      if (deleted) {
        toast.success("Bill deleted successfully.")
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
              <CardTitle>Bills unavailable</CardTitle>
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
                <h1 className="text-2xl font-bold tracking-normal">Bill Management</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Record purchase bills and import books into branch stock.
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/bills/create")}>
                <PlusIcon />
                Add Bill
              </Button>
            </section>

            <BillsFilters
              bills={state.bills}
              searchQuery={state.searchQuery}
              branchFilter={state.branchFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onBranchFilterChange={viewModel.setBranchFilter}
            />

            <BillsTable
              bills={state.filteredBills}
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
            <DialogTitle>Delete Bill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the bill from &ldquo;
              {deleteBill?.companyName}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBill(null)}>
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
    </>
  )
}
