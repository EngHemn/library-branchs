"use client"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

export type BranchNode = {
  branch: Branch
  subBranches: Branch[]
}

export type AsyncStatus = "idle" | "loading" | "success" | "error"
export type SalesFilter = "all" | string

export type SalesViewModelState = {
  branchNodes: BranchNode[]
  branchesStatus: AsyncStatus
  branchesError: string | null
  shoppingBranchId: string | null
  displayedBranchId: string | null
  shoppingBranch: Branch | null
  displayedBranch: Branch | null
  books: SaleBook[]
  filteredBooks: SaleBook[]
  booksStatus: AsyncStatus
  booksError: string | null
  cart: CartItem[]
  cartSubtotal: number
  cartDiscountAmount: number
  cartTotal: number
  cartItemCount: number
  pendingBranchId: string | null
  pendingBranchName: string | null
  isChangeBranchDialogOpen: boolean
  isPlacingSale: boolean
  saleResult: Sale | null
  saleError: string | null
  isViewingOtherBranch: boolean
  searchQuery: string
  languageFilter: SalesFilter
  categoryFilter: SalesFilter
  authorFilter: SalesFilter
  translatorFilter: SalesFilter
  languages: string[]
  categories: string[]
  authors: string[]
  translators: string[]
  showBranchSidebar: boolean
  isSubBranchUser: boolean
}
