"use client"

import { useState } from "react"

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
import { useStockQueries } from "./useStockQueries"
import type { AsyncStatus, StockViewModelState } from "./StockViewModelState"

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
  toggleStockGroupExpanded: (groupId: string) => void
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
  const stockData = useStockQueries(stockUseCase)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMainBranchId, setSelectedMainBranchIdState] = useState<string | null>(null)
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
  const [expandedStockGroupIds, setExpandedStockGroupIds] = useState<string[]>([])

  function setSelectedMainBranchId(id: string | null): void {
    setSelectedMainBranchIdState(id)
    setSelectedSubBranchId(null)
  }

  function openAddStockDialog(row: StockRow): void {
    setSelectedStockRow(row)
    stockData.setSubmitError(null)
    setIsAddStockDialogOpen(true)
  }

  function openReduceStockDialog(row: StockRow): void {
    setSelectedStockRow(row)
    stockData.setSubmitError(null)
    setIsReduceStockDialogOpen(true)
  }

  function openTransferDialog(row: StockRow | null): void {
    setSelectedStockRow(row)
    stockData.setSubmitError(null)
    setIsTransferDialogOpen(true)
  }

  function closeDialogs(): void {
    setIsAddStockDialogOpen(false)
    setIsReduceStockDialogOpen(false)
    setIsTransferDialogOpen(false)
    setSelectedStockRow(null)
    stockData.setSubmitError(null)
  }

  async function addStock(input: AddStockInput): Promise<void> {
    try {
      await stockData.addStock(input)
      setIsAddStockDialogOpen(false)
      setSelectedStockRow(null)
    } catch {
      // submitError set via onError in useStockQueries
    }
  }

  async function reduceStock(input: ReduceStockInput): Promise<void> {
    try {
      await stockData.reduceStock(input)
      setIsReduceStockDialogOpen(false)
      setSelectedStockRow(null)
    } catch {
      // submitError set via onError in useStockQueries
    }
  }

  async function transferStock(input: TransferStockInput): Promise<void> {
    try {
      await stockData.transferStock(input)
      setIsTransferDialogOpen(false)
      setSelectedStockRow(null)
    } catch {
      // submitError set via onError in useStockQueries
    }
  }

  function toggleStockGroupExpanded(groupId: string): void {
    setExpandedStockGroupIds((ids) =>
      ids.includes(groupId)
        ? ids.filter((id) => id !== groupId)
        : [...ids, groupId]
    )
  }

  const { stockRows, movements } = stockData

  const filteredStockRows = filterStockRows(
    stockRows,
    searchQuery,
    selectedMainBranchId,
    selectedSubBranchId,
    selectedCategory,
    showLowStock,
    showOutOfStock
  )

  const filteredMovements = filterMovements(
    movements,
    movementSearchQuery,
    movementTypeFilter,
    movementBranchFilter,
    movementDateFrom,
    movementDateTo,
    movementUserFilter
  )

  const state: StockViewModelState = {
    stockRows,
    stockStatus: stockData.stockStatus,
    stockError: stockData.stockError,
    summary: stockData.summary,
    summaryStatus: stockData.summaryStatus,
    movements,
    movementsStatus: stockData.movementsStatus,
    movementsError: stockData.movementsError,
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
    isSubmitting: stockData.isSubmitting,
    submitError: stockData.submitError,
    expandedStockGroupIds,
    filteredStockRows,
    filteredMovements,
    availableMainBranches: getMainBranches(stockRows),
    availableSubBranches: getSubBranches(stockRows, selectedMainBranchId),
    availableCategories: getCategories(stockRows),
    availableUsers: getMovementUsers(movements),
    availableMovementBranches: getMovementBranches(movements),
  }

  return {
    state,
    setSearchQuery,
    setSelectedMainBranchId,
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
    toggleStockGroupExpanded,
    reload: stockData.reload,
  }
}
