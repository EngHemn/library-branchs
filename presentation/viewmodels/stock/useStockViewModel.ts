"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type {
  AddStockInput,
  ReduceStockInput,
  StockRow,
  StockSummary,
  TransferStockInput,
} from "@/domain/entities/stock/Stock"
import type { StockMovement } from "@/domain/entities/stock/StockMovement"
import type { MovementType } from "@/domain/entities/stock/StockMovement"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"

type StockViewModelState = {
  stockRows: StockRow[]
  stockStatus: AsyncStatus
  stockError: string | null

  summary: StockSummary | null
  summaryStatus: AsyncStatus

  movements: StockMovement[]
  movementsStatus: AsyncStatus
  movementsError: string | null

  searchQuery: string
  selectedMainBranchId: string | null
  selectedSubBranchId: string | null
  selectedCategory: string | null
  showLowStock: boolean
  showOutOfStock: boolean

  movementSearchQuery: string
  movementTypeFilter: MovementType | null
  movementBranchFilter: string | null
  movementDateFrom: string | null
  movementDateTo: string | null
  movementUserFilter: string | null

  isAddStockDialogOpen: boolean
  isReduceStockDialogOpen: boolean
  isTransferDialogOpen: boolean
  selectedStockRow: StockRow | null

  isSubmitting: boolean
  submitError: string | null

  filteredStockRows: StockRow[]
  filteredMovements: StockMovement[]

  availableMainBranches: { id: string; name: string }[]
  availableSubBranches: { id: string; name: string }[]
  availableCategories: string[]
  availableUsers: string[]
  availableMovementBranches: { id: string; name: string }[]
}

export type StockViewModel = {
  state: StockViewModelState
  setSearchQuery: (q: string) => void
  setSelectedMainBranchId: (id: string | null) => void
  setSelectedSubBranchId: (id: string | null) => void
  setSelectedCategory: (cat: string | null) => void
  setShowLowStock: (val: boolean) => void
  setShowOutOfStock: (val: boolean) => void
  openAddStockDialog: (row: StockRow) => void
  openReduceStockDialog: (row: StockRow) => void
  openTransferDialog: (row: StockRow | null) => void
  closeDialogs: () => void
  addStock: (input: AddStockInput) => Promise<void>
  reduceStock: (input: ReduceStockInput) => Promise<void>
  transferStock: (input: TransferStockInput) => Promise<void>
  setMovementSearchQuery: (q: string) => void
  setMovementTypeFilter: (t: MovementType | null) => void
  setMovementBranchFilter: (id: string | null) => void
  setMovementDateFrom: (d: string | null) => void
  setMovementDateTo: (d: string | null) => void
  setMovementUserFilter: (u: string | null) => void
  reload: () => Promise<void>
}

function getMainBranches(rows: StockRow[]): { id: string; name: string }[] {
  const seen = new Map<string, string>()
  for (const row of rows) {
    if (!seen.has(row.branchId)) seen.set(row.branchId, row.branchName)
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
}

function getSubBranches(
  rows: StockRow[],
  mainBranchId: string | null
): { id: string; name: string }[] {
  const seen = new Map<string, string>()
  for (const row of rows) {
    if (
      row.subBranchId &&
      row.subBranchName &&
      (mainBranchId === null || row.branchId === mainBranchId)
    ) {
      if (!seen.has(row.subBranchId)) seen.set(row.subBranchId, row.subBranchName)
    }
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
}

function getCategories(rows: StockRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.category))).sort()
}

function getMovementUsers(movements: StockMovement[]): string[] {
  return Array.from(new Set(movements.map((m) => m.userName))).sort()
}

function getMovementBranches(
  movements: StockMovement[]
): { id: string; name: string }[] {
  const seen = new Map<string, string>()
  for (const m of movements) {
    if (m.fromBranchId && m.fromBranchName)
      seen.set(m.fromBranchId, m.fromBranchName)
    if (m.toBranchId && m.toBranchName) seen.set(m.toBranchId, m.toBranchName)
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
}

function filterStockRows(
  rows: StockRow[],
  searchQuery: string,
  mainBranchId: string | null,
  subBranchId: string | null,
  category: string | null,
  showLowStock: boolean,
  showOutOfStock: boolean
): StockRow[] {
  return rows.filter((row) => {
    if (
      searchQuery &&
      !row.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !row.isbn.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (mainBranchId && row.branchId !== mainBranchId) return false
    if (subBranchId && row.subBranchId !== subBranchId) return false
    if (category && row.category !== category) return false
    if (showLowStock && row.status !== "low_stock") return false
    if (showOutOfStock && row.status !== "out_of_stock") return false
    return true
  })
}

function filterMovements(
  movements: StockMovement[],
  searchQuery: string,
  typeFilter: MovementType | null,
  branchFilter: string | null,
  dateFrom: string | null,
  dateTo: string | null,
  userFilter: string | null
): StockMovement[] {
  return movements.filter((m) => {
    if (
      searchQuery &&
      !m.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (typeFilter && m.movementType !== typeFilter) return false
    if (
      branchFilter &&
      m.fromBranchId !== branchFilter &&
      m.toBranchId !== branchFilter
    ) {
      return false
    }
    if (dateFrom && new Date(m.createdAt) < new Date(dateFrom)) return false
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      if (new Date(m.createdAt) > to) return false
    }
    if (userFilter && m.userName !== userFilter) return false
    return true
  })
}

export function useStockViewModel(stockUseCase: StockUseCase): StockViewModel {
  const [stockRows, setStockRows] = useState<StockRow[]>([])
  const [stockStatus, setStockStatus] = useState<AsyncStatus>("idle")
  const [stockError, setStockError] = useState<string | null>(null)

  const [summary, setSummary] = useState<StockSummary | null>(null)
  const [summaryStatus, setSummaryStatus] = useState<AsyncStatus>("idle")

  const [movements, setMovements] = useState<StockMovement[]>([])
  const [movementsStatus, setMovementsStatus] = useState<AsyncStatus>("idle")
  const [movementsError, setMovementsError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMainBranchId, setSelectedMainBranchId] = useState<string | null>(null)
  const [selectedSubBranchId, setSelectedSubBranchId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showLowStock, setShowLowStock] = useState(false)
  const [showOutOfStock, setShowOutOfStock] = useState(false)

  const [movementSearchQuery, setMovementSearchQuery] = useState("")
  const [movementTypeFilter, setMovementTypeFilter] = useState<MovementType | null>(null)
  const [movementBranchFilter, setMovementBranchFilter] = useState<string | null>(null)
  const [movementDateFrom, setMovementDateFrom] = useState<string | null>(null)
  const [movementDateTo, setMovementDateTo] = useState<string | null>(null)
  const [movementUserFilter, setMovementUserFilter] = useState<string | null>(null)

  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false)
  const [isReduceStockDialogOpen, setIsReduceStockDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [selectedStockRow, setSelectedStockRow] = useState<StockRow | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    setStockStatus("loading")
    setSummaryStatus("loading")
    setMovementsStatus("loading")

    const [stockResult, summaryResult, movementsResult] = await Promise.all([
      stockUseCase.getStockRows(),
      stockUseCase.getStockSummary(),
      stockUseCase.getStockMovements(),
    ])

    if (stockResult.success) {
      setStockRows(stockResult.data)
      setStockStatus("success")
    } else {
      setStockError(stockResult.error)
      setStockStatus("error")
    }

    if (summaryResult.success) {
      setSummary(summaryResult.data)
      setSummaryStatus("success")
    } else {
      setSummaryStatus("error")
    }

    if (movementsResult.success) {
      setMovements(movementsResult.data)
      setMovementsStatus("success")
    } else {
      setMovementsError(movementsResult.error)
      setMovementsStatus("error")
    }
  }, [stockUseCase])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const openAddStockDialog = useCallback((row: StockRow) => {
    setSelectedStockRow(row)
    setSubmitError(null)
    setIsAddStockDialogOpen(true)
  }, [])

  const openReduceStockDialog = useCallback((row: StockRow) => {
    setSelectedStockRow(row)
    setSubmitError(null)
    setIsReduceStockDialogOpen(true)
  }, [])

  const openTransferDialog = useCallback((row: StockRow | null) => {
    setSelectedStockRow(row)
    setSubmitError(null)
    setIsTransferDialogOpen(true)
  }, [])

  const closeDialogs = useCallback(() => {
    setIsAddStockDialogOpen(false)
    setIsReduceStockDialogOpen(false)
    setIsTransferDialogOpen(false)
    setSelectedStockRow(null)
    setSubmitError(null)
  }, [])

  const addStock = useCallback(
    async (input: AddStockInput) => {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await stockUseCase.addStock(input)
      setIsSubmitting(false)
      if (!result.success) {
        setSubmitError(result.error)
        return
      }
      setStockRows((prev) =>
        prev.map((r) => (r.id === result.data.id ? result.data : r))
      )
      setIsAddStockDialogOpen(false)
      setSelectedStockRow(null)
    },
    [stockUseCase]
  )

  const reduceStock = useCallback(
    async (input: ReduceStockInput) => {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await stockUseCase.reduceStock(input)
      setIsSubmitting(false)
      if (!result.success) {
        setSubmitError(result.error)
        return
      }
      setStockRows((prev) =>
        prev.map((r) => (r.id === result.data.id ? result.data : r))
      )
      setIsReduceStockDialogOpen(false)
      setSelectedStockRow(null)
    },
    [stockUseCase]
  )

  const transferStock = useCallback(
    async (input: TransferStockInput) => {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await stockUseCase.transferStock(input)
      setIsSubmitting(false)
      if (!result.success) {
        setSubmitError(result.error)
        return
      }
      void loadAll()
      setIsTransferDialogOpen(false)
      setSelectedStockRow(null)
    },
    [stockUseCase, loadAll]
  )

  const handleSetMainBranchId = useCallback((id: string | null) => {
    setSelectedMainBranchId(id)
    setSelectedSubBranchId(null)
  }, [])

  const filteredStockRows = useMemo(
    () =>
      filterStockRows(
        stockRows,
        searchQuery,
        selectedMainBranchId,
        selectedSubBranchId,
        selectedCategory,
        showLowStock,
        showOutOfStock
      ),
    [
      stockRows,
      searchQuery,
      selectedMainBranchId,
      selectedSubBranchId,
      selectedCategory,
      showLowStock,
      showOutOfStock,
    ]
  )

  const filteredMovements = useMemo(
    () =>
      filterMovements(
        movements,
        movementSearchQuery,
        movementTypeFilter,
        movementBranchFilter,
        movementDateFrom,
        movementDateTo,
        movementUserFilter
      ),
    [
      movements,
      movementSearchQuery,
      movementTypeFilter,
      movementBranchFilter,
      movementDateFrom,
      movementDateTo,
      movementUserFilter,
    ]
  )

  const availableMainBranches = useMemo(
    () => getMainBranches(stockRows),
    [stockRows]
  )
  const availableSubBranches = useMemo(
    () => getSubBranches(stockRows, selectedMainBranchId),
    [stockRows, selectedMainBranchId]
  )
  const availableCategories = useMemo(
    () => getCategories(stockRows),
    [stockRows]
  )
  const availableUsers = useMemo(
    () => getMovementUsers(movements),
    [movements]
  )
  const availableMovementBranches = useMemo(
    () => getMovementBranches(movements),
    [movements]
  )

  const state = useMemo<StockViewModelState>(
    () => ({
      stockRows,
      stockStatus,
      stockError,
      summary,
      summaryStatus,
      movements,
      movementsStatus,
      movementsError,
      searchQuery,
      selectedMainBranchId,
      selectedSubBranchId,
      selectedCategory,
      showLowStock,
      showOutOfStock,
      movementSearchQuery,
      movementTypeFilter,
      movementBranchFilter,
      movementDateFrom,
      movementDateTo,
      movementUserFilter,
      isAddStockDialogOpen,
      isReduceStockDialogOpen,
      isTransferDialogOpen,
      selectedStockRow,
      isSubmitting,
      submitError,
      filteredStockRows,
      filteredMovements,
      availableMainBranches,
      availableSubBranches,
      availableCategories,
      availableUsers,
      availableMovementBranches,
    }),
    [
      stockRows,
      stockStatus,
      stockError,
      summary,
      summaryStatus,
      movements,
      movementsStatus,
      movementsError,
      searchQuery,
      selectedMainBranchId,
      selectedSubBranchId,
      selectedCategory,
      showLowStock,
      showOutOfStock,
      movementSearchQuery,
      movementTypeFilter,
      movementBranchFilter,
      movementDateFrom,
      movementDateTo,
      movementUserFilter,
      isAddStockDialogOpen,
      isReduceStockDialogOpen,
      isTransferDialogOpen,
      selectedStockRow,
      isSubmitting,
      submitError,
      filteredStockRows,
      filteredMovements,
      availableMainBranches,
      availableSubBranches,
      availableCategories,
      availableUsers,
      availableMovementBranches,
    ]
  )

  return {
    state,
    setSearchQuery,
    setSelectedMainBranchId: handleSetMainBranchId,
    setSelectedSubBranchId,
    setSelectedCategory,
    setShowLowStock,
    setShowOutOfStock,
    openAddStockDialog,
    openReduceStockDialog,
    openTransferDialog,
    closeDialogs,
    addStock,
    reduceStock,
    transferStock,
    setMovementSearchQuery,
    setMovementTypeFilter,
    setMovementBranchFilter,
    setMovementDateFrom,
    setMovementDateTo,
    setMovementUserFilter,
    reload: loadAll,
  }
}
