"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

export type BranchNode = {
  branch: Branch
  subBranches: Branch[]
}

type AsyncStatus = "idle" | "loading" | "success" | "error"
type SalesFilter = "all" | string

type SalesViewModelState = {
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
}

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
    if (value) {
      values.add(value)
    }
  }
  return Array.from(values).sort()
}

function buildBranchNodes(branches: Branch[]): BranchNode[] {
  const mainBranches = branches.filter((b) => b.type === "main")
  return mainBranches.map((main) => ({
    branch: main,
    subBranches: branches.filter((b) => b.parentBranch === main.branchName),
  }))
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

  return { subtotal, discountAmount, total: subtotal - discountAmount, itemCount }
}

export function useSalesViewModel(salesUseCase: SalesUseCase): SalesViewModel {
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchesStatus, setBranchesStatus] = useState<AsyncStatus>("idle")
  const [branchesError, setBranchesError] = useState<string | null>(null)

  const [books, setBooks] = useState<SaleBook[]>([])
  const [booksStatus, setBooksStatus] = useState<AsyncStatus>("idle")
  const [booksError, setBooksError] = useState<string | null>(null)

  const [shoppingBranchId, setShoppingBranchId] = useState<string | null>(null)
  const [displayedBranchId, setDisplayedBranchId] = useState<string | null>(null)

  const [cart, setCart] = useState<CartItem[]>([])
  const [pendingBranchId, setPendingBranchId] = useState<string | null>(null)
  const [isChangeBranchDialogOpen, setIsChangeBranchDialogOpen] =
    useState(false)

  const [isPlacingSale, setIsPlacingSale] = useState(false)
  const [saleResult, setSaleResult] = useState<Sale | null>(null)
  const [saleError, setSaleError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<SalesFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<SalesFilter>("all")
  const [authorFilter, setAuthorFilter] = useState<SalesFilter>("all")
  const [translatorFilter, setTranslatorFilter] = useState<SalesFilter>("all")

  useEffect(() => {
    setBranchesStatus("loading")
    setBranchesError(null)
    setBooksStatus("loading")
    setBooksError(null)
    Promise.all([salesUseCase.getBranches(), salesUseCase.getAllBooks()]).then(
      ([branchesResult, booksResult]) => {
        if (!branchesResult.success) {
          setBranchesStatus("error")
          setBranchesError(branchesResult.error)
          return
        }

        if (!booksResult.success) {
          setBooksStatus("error")
          setBooksError(booksResult.error)
          return
        }

        setBranches(branchesResult.data)
        setBooks(booksResult.data)
        setBranchesStatus("success")
        setBooksStatus("success")
      }
    )
  }, [salesUseCase])

  const loadBooksForBranch = useCallback(
    async (branchId: string): Promise<void> => {
      setBooksStatus("loading")
      setBooksError(null)
      const result = await salesUseCase.getBooksByBranch(branchId)
      if (!result.success) {
        setBooksStatus("error")
        setBooksError(result.error)
        return
      }
      setBooks(result.data)
      setBooksStatus("success")
    },
    [salesUseCase]
  )

  const viewBranchBooks = useCallback(
    (branchId: string): void => {
      setDisplayedBranchId(branchId)
      setSearchQuery("")
      setLanguageFilter("all")
      setCategoryFilter("all")
      setAuthorFilter("all")
      setTranslatorFilter("all")
      void loadBooksForBranch(branchId)
    },
    [loadBooksForBranch]
  )

  const requestSetShoppingBranch = useCallback(
    (branchId: string): void => {
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
    },
    [shoppingBranchId, cart.length, viewBranchBooks]
  )

  const confirmBranchChange = useCallback((): void => {
    if (!pendingBranchId) return
    setCart([])
    setShoppingBranchId(pendingBranchId)
    viewBranchBooks(pendingBranchId)
    setPendingBranchId(null)
    setIsChangeBranchDialogOpen(false)
  }, [pendingBranchId, viewBranchBooks])

  const cancelBranchChange = useCallback((): void => {
    setPendingBranchId(null)
    setIsChangeBranchDialogOpen(false)
  }, [])

  const addToCart = useCallback((book: SaleBook): void => {
    if (!shoppingBranchId) {
      setShoppingBranchId(book.branchId)
      setDisplayedBranchId(book.branchId)
      setSearchQuery("")
      setLanguageFilter("all")
      setCategoryFilter("all")
      setAuthorFilter("all")
      setTranslatorFilter("all")
      void loadBooksForBranch(book.branchId)
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
  }, [shoppingBranchId, loadBooksForBranch])

  const removeFromCart = useCallback((bookId: string): void => {
    setCart((current) => current.filter((item) => item.book.id !== bookId))
  }, [])

  const updateQuantity = useCallback(
    (bookId: string, quantity: number): void => {
      if (quantity <= 0) {
        removeFromCart(bookId)
        return
      }
      setCart((current) =>
        current.map((item) =>
          item.book.id === bookId ? { ...item, quantity } : item
        )
      )
    },
    [removeFromCart]
  )

  const clearCart = useCallback((): void => {
    setCart([])
  }, [])

  const placeSale = useCallback(async (): Promise<void> => {
    if (!shoppingBranchId || cart.length === 0) return
    setIsPlacingSale(true)
    setSaleError(null)
    const result = await salesUseCase.placeSale(shoppingBranchId, cart)
    if (!result.success) {
      setSaleError(result.error)
      setIsPlacingSale(false)
      return
    }
    setSaleResult(result.data)
    setCart([])
    setIsPlacingSale(false)
  }, [shoppingBranchId, cart, salesUseCase])

  const resetSale = useCallback((): void => {
    setSaleResult(null)
    setSaleError(null)
  }, [])

  const branchNodes = useMemo(() => buildBranchNodes(branches), [branches])

  const { subtotal, discountAmount, total, itemCount } = useMemo(
    () => computeCartTotals(cart),
    [cart]
  )

  const shoppingBranch = useMemo(
    () => branches.find((b) => b.id === shoppingBranchId) ?? null,
    [branches, shoppingBranchId]
  )

  const displayedBranch = useMemo(
    () => branches.find((b) => b.id === displayedBranchId) ?? null,
    [branches, displayedBranchId]
  )

  const pendingBranch = useMemo(
    () => branches.find((b) => b.id === pendingBranchId) ?? null,
    [branches, pendingBranchId]
  )

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const hasSearch = q.length > 0

    return books.filter(
      (b) =>
        (!hasSearch ||
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)) &&
        (languageFilter === "all" || b.language === languageFilter) &&
        (categoryFilter === "all" || b.category === categoryFilter) &&
        (authorFilter === "all" || b.author === authorFilter) &&
        (translatorFilter === "all" || b.translator === translatorFilter)
    )
  }, [
    books,
    searchQuery,
    languageFilter,
    categoryFilter,
    authorFilter,
    translatorFilter,
  ])

  const languages = useMemo(
    () => getUniqueValues(books, (book) => book.language),
    [books]
  )
  const categories = useMemo(
    () => getUniqueValues(books, (book) => book.category),
    [books]
  )
  const authors = useMemo(() => getUniqueValues(books, (book) => book.author), [books])
  const translators = useMemo(
    () => getUniqueValues(books, (book) => book.translator ?? null),
    [books]
  )

  const state = useMemo<SalesViewModelState>(
    () => ({
      branchNodes,
      branchesStatus,
      branchesError,
      shoppingBranchId,
      displayedBranchId,
      shoppingBranch,
      displayedBranch,
      books,
      filteredBooks,
      booksStatus,
      booksError,
      cart,
      cartSubtotal: subtotal,
      cartDiscountAmount: discountAmount,
      cartTotal: total,
      cartItemCount: itemCount,
      pendingBranchId,
      pendingBranchName: pendingBranch?.branchName ?? null,
      isChangeBranchDialogOpen,
      isPlacingSale,
      saleResult,
      saleError,
      isViewingOtherBranch:
        displayedBranchId !== null &&
        shoppingBranchId !== null &&
        displayedBranchId !== shoppingBranchId,
      searchQuery,
      languageFilter,
      categoryFilter,
      authorFilter,
      translatorFilter,
      languages,
      categories,
      authors,
      translators,
    }),
    [
      branchNodes,
      branchesStatus,
      branchesError,
      shoppingBranchId,
      displayedBranchId,
      shoppingBranch,
      displayedBranch,
      books,
      filteredBooks,
      booksStatus,
      booksError,
      cart,
      subtotal,
      discountAmount,
      total,
      itemCount,
      pendingBranchId,
      pendingBranch,
      isChangeBranchDialogOpen,
      isPlacingSale,
      saleResult,
      saleError,
      searchQuery,
      languageFilter,
      categoryFilter,
      authorFilter,
      translatorFilter,
      languages,
      categories,
      authors,
      translators,
    ]
  )

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
    resetSale,
  }
}
