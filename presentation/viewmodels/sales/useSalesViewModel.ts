"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import {
  clearStoredSalesCart,
  readStoredSalesCart,
  writeStoredSalesCart,
} from "@/lib/salesCartStorage"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import { isSingleBranchManagedUser } from "@/lib/salesStockBranchScope"
import { useSalesData } from "./useSalesData"
import type {
  BranchNode,
  SalesFilter,
  SalesViewModelState,
} from "./SalesViewModelState"
export type { BranchNode } from "./SalesViewModelState"

export type SalesViewModel = {
  state: SalesViewModelState
  viewBranchBooks: (branchId: string) => void
  requestSetShoppingBranch: (branchId: string) => void
  confirmBranchChange: () => void
  cancelBranchChange: () => void
  addToCart: (book: SaleBook) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  placeSale: () => Promise<void>
  setSearchQuery: (query: string) => void
  setLanguageFilter: (value: SalesFilter) => void
  setCategoryFilter: (value: SalesFilter) => void
  setAuthorFilter: (value: SalesFilter) => void
  setTranslatorFilter: (value: SalesFilter) => void
  resetSale: () => void
}

function getUniqueValues(
  books: SaleBook[],
  accessor: (book: SaleBook) => string | null
): string[] {
  const values = new Set<string>()
  for (const book of books) {
    const value = accessor(book)
    if (value) values.add(value)
  }
  return Array.from(values).sort()
}

function buildScopedBranchNodes(
  branches: Branch[],
  user: User | null
): BranchNode[] {
  if (!user || isSingleBranchManagedUser(user)) {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const mainBranch = branches.find(
    (branch) => branch.id === userBranchId && branch.type === "main"
  )

  if (!mainBranch) {
    return []
  }

  const subBranches = branches.filter(
    (branch) =>
      branch.type === "sub" && branch.parentBranch === mainBranch.branchName
  )

  return [{ branch: mainBranch, subBranches }]
}

function computeCartTotals(cart: CartItem[]): {
  subtotal: number
  discountAmount: number
  total: number
  itemCount: number
} {
  let subtotal = 0
  let discountAmount = 0
  let itemCount = 0
  for (const item of cart) {
    subtotal += item.book.price * item.quantity
    discountAmount +=
      ((item.book.price * item.book.discount) / 100) * item.quantity
    itemCount += item.quantity
  }
  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    itemCount,
  }
}

export function useSalesViewModel(
  authUseCase: AuthUseCase,
  salesUseCase: SalesUseCase
): SalesViewModel {
  const salesData = useSalesData(salesUseCase)
  const { setDisplayedBranch, displayedBranchId } = salesData

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const user = userQuery.data ?? null
  const userId = user?.id ?? null
  const userBranchId = user ? resolveUserBranchId(user) : null
  const isSubBranch = user ? isSingleBranchManagedUser(user) : false

  const [shoppingBranchId, setShoppingBranchId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [pendingBranchId, setPendingBranchId] = useState<string | null>(null)
  const [isChangeBranchDialogOpen, setIsChangeBranchDialogOpen] =
    useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<SalesFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<SalesFilter>("all")
  const [authorFilter, setAuthorFilter] = useState<SalesFilter>("all")
  const [translatorFilter, setTranslatorFilter] = useState<SalesFilter>("all")

  const hydratedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!userId) {
      hydratedUserIdRef.current = null
      return
    }

    if (hydratedUserIdRef.current !== userId) {
      hydratedUserIdRef.current = userId
      const storedCart = readStoredSalesCart(userId)
      setCart(storedCart.cart)

      if (isSubBranch && userBranchId) {
        setShoppingBranchId(userBranchId)
        setDisplayedBranch(userBranchId)
        return
      }

      if (storedCart.shoppingBranchId) {
        setShoppingBranchId(storedCart.shoppingBranchId)
      }

      if (storedCart.displayedBranchId) {
        setDisplayedBranch(storedCart.displayedBranchId)
      }
      return
    }

    writeStoredSalesCart(userId, {
      cart,
      shoppingBranchId,
      displayedBranchId,
    })
  }, [
    userId,
    cart,
    shoppingBranchId,
    displayedBranchId,
    isSubBranch,
    userBranchId,
    setDisplayedBranch,
  ])

  function resetFilters(): void {
    setSearchQuery("")
    setLanguageFilter("all")
    setCategoryFilter("all")
    setAuthorFilter("all")
    setTranslatorFilter("all")
  }

  function viewBranchBooks(branchId: string): void {
    salesData.setDisplayedBranch(branchId)
    resetFilters()
  }

  function requestSetShoppingBranch(branchId: string): void {
    if (branchId === shoppingBranchId) {
      viewBranchBooks(branchId)
      return
    }
    if (cart.length === 0) {
      setShoppingBranchId(branchId)
      viewBranchBooks(branchId)
      return
    }
    setPendingBranchId(branchId)
    setIsChangeBranchDialogOpen(true)
  }

  function confirmBranchChange(): void {
    if (!pendingBranchId) return
    setCart([])
    if (userId) {
      clearStoredSalesCart(userId)
    }
    setShoppingBranchId(pendingBranchId)
    viewBranchBooks(pendingBranchId)
    setPendingBranchId(null)
    setIsChangeBranchDialogOpen(false)
  }

  function cancelBranchChange(): void {
    setPendingBranchId(null)
    setIsChangeBranchDialogOpen(false)
  }

  function addToCart(book: SaleBook): void {
    if (!shoppingBranchId) {
      setShoppingBranchId(book.branchId)
      salesData.setDisplayedBranch(book.branchId)
      resetFilters()
    }
    setCart((current) => {
      const existing = current.find((item) => item.book.id === book.id)
      if (existing) {
        return current.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { book, quantity: 1 }]
    })
  }

  function removeFromCart(bookId: string): void {
    setCart((current) => current.filter((item) => item.book.id !== bookId))
  }

  function updateQuantity(bookId: string, quantity: number): void {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCart((current) =>
      current.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart(): void {
    setCart([])
    if (userId) {
      clearStoredSalesCart(userId)
    }
  }

  async function placeSale(): Promise<void> {
    if (!shoppingBranchId || cart.length === 0) return
    try {
      await salesData.placeSale(shoppingBranchId, cart)
      setCart([])
      if (userId) {
        clearStoredSalesCart(userId)
      }
    } catch {}
  }

  const { branches, books } = salesData
  const { subtotal, discountAmount, total, itemCount } = computeCartTotals(cart)

  const shoppingBranch = branches.find((b) => b.id === shoppingBranchId) ?? null
  const displayedBranch =
    branches.find((b) => b.id === displayedBranchId) ?? null
  const pendingBranch = branches.find((b) => b.id === pendingBranchId) ?? null

  const branchNodes = buildScopedBranchNodes(branches, user)
  const hasSubBranches = branchNodes.some((node) => node.subBranches.length > 0)
  const showBranchSidebar = !isSubBranch && hasSubBranches

  const q = searchQuery.trim().toLowerCase()
  const filteredBooks = books.filter(
    (b) =>
      (!q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)) &&
      (languageFilter === "all" || b.language === languageFilter) &&
      (categoryFilter === "all" || b.category === categoryFilter) &&
      (authorFilter === "all" || b.author === authorFilter) &&
      (translatorFilter === "all" || b.translator === translatorFilter)
  )

  const state: SalesViewModelState = {
    branchNodes,
    branchesStatus: salesData.branchesStatus,
    branchesError: salesData.branchesError,
    shoppingBranchId,
    displayedBranchId,
    shoppingBranch,
    displayedBranch,
    books,
    filteredBooks,
    booksStatus: salesData.booksStatus,
    booksError: salesData.booksError,
    cart,
    cartSubtotal: subtotal,
    cartDiscountAmount: discountAmount,
    cartTotal: total,
    cartItemCount: itemCount,
    pendingBranchId,
    pendingBranchName: pendingBranch?.branchName ?? null,
    isChangeBranchDialogOpen,
    isPlacingSale: salesData.isPlacingSale,
    saleResult: salesData.saleResult,
    saleError: salesData.saleError,
    isViewingOtherBranch:
      displayedBranchId !== null &&
      shoppingBranchId !== null &&
      displayedBranchId !== shoppingBranchId,
    searchQuery,
    languageFilter,
    categoryFilter,
    authorFilter,
    translatorFilter,
    languages: getUniqueValues(books, (b) => b.language),
    categories: getUniqueValues(books, (b) => b.category),
    authors: getUniqueValues(books, (b) => b.author),
    translators: getUniqueValues(books, (b) => b.translator ?? null),
    showBranchSidebar,
    isSubBranchUser: isSubBranch,
  }

  return {
    state,
    viewBranchBooks,
    requestSetShoppingBranch,
    confirmBranchChange,
    cancelBranchChange,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeSale,
    setSearchQuery,
    setLanguageFilter,
    setCategoryFilter,
    setAuthorFilter,
    setTranslatorFilter,
    resetSale: salesData.resetSale,
  }
}
