"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fakeBranches } from "@/data/fake/fakeBranches"
import type { Bill } from "@/domain/entities/bill/Bill"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import {
  getDashboardBranchScope,
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type {
  BillAddedByFilter,
  BillBranchFilter,
  BillBranchFilterOption,
  BillAddedByFilterOption,
  BillsFilterState,
  BillsStatus,
  BillsViewModelState,
} from "./BillsViewModelState"
export type { BillBranchFilter } from "./BillsViewModelState"
export type { BillBranchFilterOption } from "./BillsViewModelState"
export type { BillAddedByFilter } from "./BillsViewModelState"
export type { BillAddedByFilterOption } from "./BillsViewModelState"
export type { BillsFilterState } from "./BillsViewModelState"

type BillsViewModel = {
  state: BillsViewModelState
  setSearchQuery: (value: string) => void
  setBranchFilter: (value: BillBranchFilter) => void
  setAddedByFilter: (value: BillAddedByFilter) => void
  setDateFrom: (dateFrom: string | null) => void
  setDateTo: (dateTo: string | null) => void
  deleteBill: (billId: string) => Promise<boolean>
  reload: () => Promise<void>
}

const defaultFilters: BillsFilterState = {
  searchQuery: "",
  branchFilter: "current",
  addedByFilter: "all",
  dateFrom: null,
  dateTo: null,
}

const allDashboardBranches = fakeBranches.map((branch) => ({
  id: branch.id,
  name: branch.branchName,
}))

function resolveBranchFilterId(
  branchFilter: BillBranchFilter,
  userBranchId: string
): string {
  return branchFilter === "current" ? userBranchId : branchFilter
}

function getScopedBranchIds(user: User): string[] {
  return getDashboardBranchScope(user, allDashboardBranches).branchIds
}

function getBranchFilterOptions(
  user: User,
  currentBranchLabel: string
): BillBranchFilterOption[] {
  if (isBranchScopedDashboardUser(user)) {
    return []
  }

  const userBranchId = resolveUserBranchId(user)
  const branchScope = getDashboardBranchScope(user, allDashboardBranches)

  const otherBranches = branchScope.branches
    .filter((branch) => branch.id !== userBranchId)
    .map((branch) => ({ value: branch.id, label: branch.name }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return [{ value: "current", label: currentBranchLabel }, ...otherBranches]
}

function getAddedByFilterOptions(bills: Bill[]): BillAddedByFilterOption[] {
  const optionsById = new Map<string, string>()

  for (const bill of bills) {
    optionsById.set(bill.addedBy.staffId, bill.addedBy.staffName)
  }

  return Array.from(optionsById.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label))
}

function matchesDateRange(
  bill: Bill,
  dateFrom: string | null,
  dateTo: string | null
): boolean {
  const billDate = new Date(bill.billDate)

  if (dateFrom) {
    const from = new Date(dateFrom)
    from.setHours(0, 0, 0, 0)
    if (billDate < from) {
      return false
    }
  }

  if (dateTo) {
    const to = new Date(dateTo)
    to.setHours(23, 59, 59, 999)
    if (billDate > to) {
      return false
    }
  }

  return true
}

function filterBills(
  bills: Bill[],
  filters: BillsFilterState,
  scopedBranchIds: string[],
  isSubBranch: boolean,
  userBranchId: string
): Bill[] {
  const effectiveBranchId = isSubBranch
    ? userBranchId
    : resolveBranchFilterId(filters.branchFilter, userBranchId)

  const normalizedSearch = filters.searchQuery.trim().toLowerCase()

  return bills.filter((bill) => {
    if (!scopedBranchIds.includes(bill.branchId)) {
      return false
    }

    if (bill.branchId !== effectiveBranchId) {
      return false
    }

    const matchesSearch =
      normalizedSearch.length === 0 ||
      bill.companyName.toLowerCase().includes(normalizedSearch) ||
      bill.branchName.toLowerCase().includes(normalizedSearch) ||
      bill.id.toLowerCase().includes(normalizedSearch) ||
      bill.phoneNumber.toLowerCase().includes(normalizedSearch) ||
      bill.addedBy.staffName.toLowerCase().includes(normalizedSearch)

    if (!matchesSearch) {
      return false
    }

    if (
      filters.addedByFilter !== "all" &&
      bill.addedBy.staffId !== filters.addedByFilter
    ) {
      return false
    }

    return matchesDateRange(bill, filters.dateFrom, filters.dateTo)
  })
}

export function useBillsViewModel(
  authUseCase: AuthUseCase,
  getBillsUseCase: GetBillsUseCase
): BillsViewModel {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BillsFilterState>(defaultFilters)

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const {
    data: bills,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const result = await getBillsUseCase.getBills()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const {
    mutateAsync: deleteBillAsync,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async (billId: string) => {
      const result = await getBillsUseCase.deleteBill(billId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
  })

  async function deleteBill(billId: string): Promise<boolean> {
    try {
      await deleteBillAsync(billId)
      return true
    } catch {
      return false
    }
  }

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), refetch()])
  }

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isBranchScopedUser = user ? isBranchScopedDashboardUser(user) : false
  const showBranchFilter = !isBranchScopedUser
  const showBranchColumn =
    !isBranchScopedUser && filters.branchFilter !== "current"
  const branchFilterOptions = user
    ? getBranchFilterOptions(user, t("bills.filters.currentBranch"))
    : []
  const scopedBranchIds = user ? getScopedBranchIds(user) : []

  const allBills = bills ?? []
  const scopedBills = allBills.filter((bill) =>
    scopedBranchIds.includes(bill.branchId)
  )
  const addedByFilterOptions = getAddedByFilterOptions(scopedBills)
  const filteredBills =
    user && userBranchId
      ? filterBills(
          allBills,
          filters,
          scopedBranchIds,
          isBranchScopedUser,
          userBranchId
        )
      : []

  const status: BillsStatus =
    userQuery.isPending || queryStatus === "pending"
      ? "loading"
      : userQuery.isError || queryStatus === "error"
        ? "error"
        : userQuery.isSuccess && queryStatus === "success"
          ? "ready"
          : "idle"

  function setSearchQuery(searchQuery: string): void {
    setFilters((current) => ({ ...current, searchQuery }))
  }

  function setBranchFilter(branchFilter: BillBranchFilter): void {
    setFilters((current) => ({ ...current, branchFilter }))
  }

  function setAddedByFilter(addedByFilter: BillAddedByFilter): void {
    setFilters((current) => ({ ...current, addedByFilter }))
  }

  function setDateFrom(dateFrom: string | null): void {
    setFilters((current) => ({ ...current, dateFrom }))
  }

  function setDateTo(dateTo: string | null): void {
    setFilters((current) => ({ ...current, dateTo }))
  }

  const state: BillsViewModelState = {
    status,
    bills: allBills,
    filteredBills,
    filters,
    branchFilterOptions,
    addedByFilterOptions,
    showBranchFilter,
    showBranchColumn,
    error: deleteError?.message ?? queryError?.message ?? null,
    isLoading: userQuery.isPending || queryStatus === "pending",
    isReady: userQuery.isSuccess && queryStatus === "success",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setBranchFilter,
    setAddedByFilter,
    setDateFrom,
    setDateTo,
    deleteBill,
    reload,
  }
}
