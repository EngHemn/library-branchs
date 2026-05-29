"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightLeft, PackageIcon, PlusIcon, WarehouseIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StockRow } from "@/domain/entities/stock/Stock"
import { AddStockDialog } from "@/presentation/components/stock/AddStockDialog"
import { StockFilters } from "@/presentation/components/stock/StockFilters"
import { StockHistoryTable } from "@/presentation/components/stock/StockHistoryTable"
import { StockSummaryCards } from "@/presentation/components/stock/StockSummaryCards"
import { StockTable } from "@/presentation/components/stock/StockTable"
import { TransferStockDialog } from "@/presentation/components/stock/TransferStockDialog"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import type { StockViewModel } from "@/presentation/viewmodels/stock/useStockViewModel"

type StockManagementScreenProps = {
  viewModel: StockViewModel
}

function LoadingStockManagementPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="rounded-lg">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-14" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-28 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function StockManagementScreen({ viewModel }: StockManagementScreenProps) {
  const router = useRouter()
  const { state } = viewModel
  const [addReduceMode, setAddReduceMode] = useState<"add" | "reduce">("add")

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Stock Management" },
  ])

  function handleAddStock(row: StockRow) {
    setAddReduceMode("add")
    viewModel.openAddStockDialog(row)
  }

  function handleReduceStock(row: StockRow) {
    setAddReduceMode("reduce")
    viewModel.openReduceStockDialog(row)
  }

  function handleViewHistory(row: StockRow) {
    viewModel.setMovementSearchQuery(row.bookTitle)
  }

  const isLoading = state.stockStatus === "idle" || state.stockStatus === "loading"
  const isHistoryLoading =
    state.movementsStatus === "idle" || state.movementsStatus === "loading"
  const isReady = state.stockStatus === "success"

  return (
    <>
      {isLoading ? <LoadingStockManagementPage /> : null}

      {state.stockStatus === "error" ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Stock management unavailable</CardTitle>
              <CardDescription>
                {state.stockError ?? "Failed to load stock data."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => viewModel.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isReady ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Stock Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage bookstore inventory across branches.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => viewModel.openTransferDialog(null)}
              >
                <ArrowRightLeft />
                Transfer Stock
              </Button>
              <Button onClick={() => router.push("/dashboard/stock/create")}>
                <PlusIcon />
                Add Stock
              </Button>
            </div>
          </section>

          <Tabs defaultValue="stock" className="gap-4">
            <TabsList className="grid w-full grid-cols-2 sm:w-fit">
              <TabsTrigger value="stock">
                <WarehouseIcon className="mr-1.5 size-4" />
                Stock
              </TabsTrigger>
              <TabsTrigger value="history">
                <PackageIcon className="mr-1.5 size-4" />
                Movement History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="space-y-4">
              <StockSummaryCards
                summary={state.summary}
                isLoading={
                  state.summaryStatus === "idle" || state.summaryStatus === "loading"
                }
              />
              <StockFilters
                searchQuery={state.searchQuery}
                onSearchChange={viewModel.setSearchQuery}
                selectedMainBranchId={state.selectedMainBranchId}
                onMainBranchChange={viewModel.setSelectedMainBranchId}
                selectedSubBranchId={state.selectedSubBranchId}
                onSubBranchChange={viewModel.setSelectedSubBranchId}
                selectedCategory={state.selectedCategory}
                onCategoryChange={viewModel.setSelectedCategory}
                showLowStock={state.showLowStock}
                onShowLowStockChange={viewModel.setShowLowStock}
                showOutOfStock={state.showOutOfStock}
                onShowOutOfStockChange={viewModel.setShowOutOfStock}
                availableMainBranches={state.availableMainBranches}
                availableSubBranches={state.availableSubBranches}
                availableCategories={state.availableCategories}
              />
              <StockTable
                rows={state.filteredStockRows}
                isLoading={false}
                onAddStock={handleAddStock}
                onReduceStock={handleReduceStock}
                onTransfer={(row) => viewModel.openTransferDialog(row)}
                onViewHistory={handleViewHistory}
                onEditStock={(row) => router.push(`/dashboard/stock/${row.id}/edit`)}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {state.movementsStatus === "error" ? (
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Movement history unavailable</CardTitle>
                    <CardDescription>
                      {state.movementsError ?? "Failed to load movement history."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => viewModel.reload()}>
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <StockHistoryTable
                  movements={state.filteredMovements}
                  isLoading={isHistoryLoading}
                  searchQuery={state.movementSearchQuery}
                  onSearchChange={viewModel.setMovementSearchQuery}
                  typeFilter={state.movementTypeFilter}
                  onTypeFilterChange={viewModel.setMovementTypeFilter}
                  branchFilter={state.movementBranchFilter}
                  onBranchFilterChange={viewModel.setMovementBranchFilter}
                  dateFrom={state.movementDateFrom}
                  onDateFromChange={viewModel.setMovementDateFrom}
                  dateTo={state.movementDateTo}
                  onDateToChange={viewModel.setMovementDateTo}
                  userFilter={state.movementUserFilter}
                  onUserFilterChange={viewModel.setMovementUserFilter}
                  availableBranches={state.availableMovementBranches}
                  availableUsers={state.availableUsers}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : null}

      <AddStockDialog
        isOpen={state.isAddStockDialogOpen || state.isReduceStockDialogOpen}
        mode={addReduceMode}
        stockRow={state.selectedStockRow}
        isSubmitting={state.isSubmitting}
        error={state.submitError}
        onClose={viewModel.closeDialogs}
        onSubmit={(stockId, quantity, notes) => {
          if (addReduceMode === "add") {
            void viewModel.addStock({ stockId, quantity, notes })
          } else {
            void viewModel.reduceStock({ stockId, quantity, notes })
          }
        }}
      />

      <TransferStockDialog
        isOpen={state.isTransferDialogOpen}
        stockRow={state.selectedStockRow}
        allRows={state.stockRows}
        isSubmitting={state.isSubmitting}
        error={state.submitError}
        onClose={viewModel.closeDialogs}
        onSubmit={(bookId, fromBranchId, toBranchId, quantity, notes) => {
          void viewModel.transferStock({ bookId, fromBranchId, toBranchId, quantity, notes })
        }}
      />
    </>
  )
}
