"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCartIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import { BranchChangeDialog } from "@/presentation/components/sales/BranchChangeDialog"
import { BranchSelector } from "@/presentation/components/sales/BranchSelector"
import { BooksForSaleGrid } from "@/presentation/components/sales/BooksForSaleGrid"
import { SalesCartPanel } from "@/presentation/components/sales/SalesCartPanel"
import { useSalesViewModel } from "@/presentation/viewmodels/sales/useSalesViewModel"

type SalesScreenProps = {
  salesUseCase: SalesUseCase
}

export function SalesScreen({ salesUseCase }: SalesScreenProps) {
  const viewModel = useSalesViewModel(salesUseCase)
  const { state } = viewModel
  const [isCartOpen, setIsCartOpen] = useState(false)

  const branchSelectorPanel = (
    <BranchSelector
      branchNodes={state.branchNodes}
      shoppingBranchId={state.shoppingBranchId}
      displayedBranchId={state.displayedBranchId}
      isLoading={state.branchesStatus === "idle" || state.branchesStatus === "loading"}
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
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
                  <BreadcrumbPage>Sales</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto pr-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/sales/history">Sales History</Link>
              </Button>

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ShoppingCartIcon className="size-4" />
                    Cart
                    {state.cartItemCount > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {state.cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full p-0 sm:max-w-md">
                  <SheetHeader className="border-b px-4 py-3">
                    <SheetTitle>Cart</SheetTitle>
                  </SheetHeader>
                  <div className="h-[calc(100vh-3.5rem)] overflow-hidden">
                    {cartPanel}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <div className="hidden flex-1  lg:flex">
          <aside className="flex w-1/4 shrink-0 flex-col  border-r">
            <div className="border-b px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Branches
              </p>
            </div>
            <ScrollArea className="flex-1 ">{branchSelectorPanel}</ScrollArea>
          </aside>

          <main className="flex flex-1 flex-col ">
            <ScrollArea className="flex-1">{booksGridPanel}</ScrollArea>
          </main>

        </div>

        <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
          <Tabs defaultValue="books" className="flex flex-1 flex-col">
            <TabsList className="mx-4 mt-3 w-auto justify-start rounded-lg">
              <TabsTrigger value="branches" className="text-xs">
                Branches
              </TabsTrigger>
              <TabsTrigger value="books" className="text-xs">
                Books
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branches" className="flex-1 overflow-hidden mt-0 pt-2">
              <ScrollArea className="h-full">{branchSelectorPanel}</ScrollArea>
            </TabsContent>

            <TabsContent value="books" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full">{booksGridPanel}</ScrollArea>
            </TabsContent>

          </Tabs>
        </div>
      </SidebarInset>

      <BranchChangeDialog
        isOpen={state.isChangeBranchDialogOpen}
        currentBranchName={state.shoppingBranch?.branchName ?? ""}
        pendingBranchName={state.pendingBranchName ?? ""}
        cartItemCount={state.cartItemCount}
        onConfirm={viewModel.confirmBranchChange}
        onCancel={viewModel.cancelBranchChange}
      />
    </SidebarProvider>
  )
}
