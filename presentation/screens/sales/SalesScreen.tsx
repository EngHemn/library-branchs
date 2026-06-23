"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import { BranchChangeDialog } from "@/presentation/components/sales/BranchChangeDialog"
import { BranchSelector } from "@/presentation/components/sales/BranchSelector"
import { BooksForSaleGrid } from "@/presentation/components/sales/BooksForSaleGrid"
import { SalesCartPanel } from "@/presentation/components/sales/SalesCartPanel"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useSalesViewModel } from "@/presentation/viewmodels/sales/useSalesViewModel"

type SalesScreenProps = {
  authUseCase: AuthUseCase
  salesUseCase: SalesUseCase
}

export function SalesScreen({ authUseCase, salesUseCase }: SalesScreenProps) {
  const { t } = useTranslation()
  const viewModel = useSalesViewModel(authUseCase, salesUseCase)
  const { state } = viewModel
  const [isCartOpen, setIsCartOpen] = useState(false)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.sales") },
  ])

  const branchSelectorPanel = (
    <BranchSelector
      branchNodes={state.branchNodes}
      shoppingBranchId={state.shoppingBranchId}
      displayedBranchId={state.displayedBranchId}
      isLoading={
        state.branchesStatus === "idle" || state.branchesStatus === "loading"
      }
      error={state.branchesError}
      cartItemCount={state.cartItemCount}
      onViewBooks={viewModel.viewBranchBooks}
      onRequestShopFromBranch={viewModel.requestSetShoppingBranch}
    />
  )

  const booksGridPanel = (
    <BooksForSaleGrid
      books={state.filteredBooks}
      booksStatus={state.booksStatus}
      booksError={state.booksError}
      displayedBranch={state.displayedBranch}
      shoppingBranch={state.shoppingBranch}
      isViewingOtherBranch={state.isViewingOtherBranch}
      cart={state.cart}
      searchQuery={state.searchQuery}
      languageFilter={state.languageFilter}
      categoryFilter={state.categoryFilter}
      authorFilter={state.authorFilter}
      translatorFilter={state.translatorFilter}
      languages={state.languages}
      categories={state.categories}
      authors={state.authors}
      translators={state.translators}
      onSearchQueryChange={viewModel.setSearchQuery}
      onLanguageFilterChange={viewModel.setLanguageFilter}
      onCategoryFilterChange={viewModel.setCategoryFilter}
      onAuthorFilterChange={viewModel.setAuthorFilter}
      onTranslatorFilterChange={viewModel.setTranslatorFilter}
      onAddToCart={viewModel.addToCart}
      onUpdateQuantity={viewModel.updateQuantity}
      onRequestShopFromDisplayedBranch={() => {
        if (state.displayedBranchId) {
          viewModel.requestSetShoppingBranch(state.displayedBranchId)
        }
      }}
      isSubBranchUser={state.isSubBranchUser}
    />
  )

  const cartPanel = (
    <SalesCartPanel
      cart={state.cart}
      subtotal={state.cartSubtotal}
      discountAmount={state.cartDiscountAmount}
      total={state.cartTotal}
      shoppingBranch={state.shoppingBranch}
      isPlacingSale={state.isPlacingSale}
      saleResult={state.saleResult}
      saleError={state.saleError}
      onRemoveFromCart={viewModel.removeFromCart}
      onUpdateQuantity={viewModel.updateQuantity}
      onClearCart={viewModel.clearCart}
      onPlaceSale={() => void viewModel.placeSale()}
      onResetSale={viewModel.resetSale}
    />
  )

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-end gap-2 border-b px-4 py-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/sales/history">
              {t("sales.screen.salesHistory")}
            </Link>
          </Button>

          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingCartIcon className="size-4" />
                {t("sales.screen.cart")}
                {state.cartItemCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {state.cartItemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full p-0 sm:max-w-md">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle>{t("sales.screen.cart")}</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100vh-3.5rem)] overflow-hidden">
                {cartPanel}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div
          className={cn(
            "hidden flex-1 lg:flex",
            !state.showBranchSidebar && "flex-col"
          )}
        >
          {state.showBranchSidebar ? (
            <aside className="flex w-1/4 shrink-0 flex-col border-r">
              <div className="border-b px-4 py-3">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {t("sales.screen.branches")}
                </p>
              </div>
              <ScrollArea className="flex-1">{branchSelectorPanel}</ScrollArea>
            </aside>
          ) : null}

          <main className="flex flex-1 flex-col">
            <ScrollArea className="flex-1">{booksGridPanel}</ScrollArea>
          </main>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
          {state.showBranchSidebar ? (
            <Tabs defaultValue="books" className="flex flex-1 flex-col">
              <TabsList className="mx-4 mt-3 w-auto justify-start rounded-lg">
                <TabsTrigger value="branches" className="text-xs">
                  {t("sales.screen.branches")}
                </TabsTrigger>
                <TabsTrigger value="books" className="text-xs">
                  {t("sales.screen.books")}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="branches"
                className="mt-0 flex-1 overflow-hidden pt-2"
              >
                <ScrollArea className="h-full">
                  {branchSelectorPanel}
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="books"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">{booksGridPanel}</ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            <ScrollArea className="flex-1">{booksGridPanel}</ScrollArea>
          )}
        </div>
      </div>

      <BranchChangeDialog
        isOpen={state.isChangeBranchDialogOpen}
        currentBranchName={state.shoppingBranch?.branchName ?? ""}
        pendingBranchName={state.pendingBranchName ?? ""}
        cartItemCount={state.cartItemCount}
        onConfirm={viewModel.confirmBranchChange}
        onCancel={viewModel.cancelBranchChange}
      />
    </>
  )
}
