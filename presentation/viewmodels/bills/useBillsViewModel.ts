"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Bill } from "@/domain/entities/bill/Bill"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"

type BillsStatus = "idle" | "loading" | "ready" | "error"

type BillsViewModelState = {
  status: BillsStatus
  bills: Bill[]
  filteredBills: Bill[]
  searchQuery: string
  branchFilter: string
  error: string | null
  isLoading: boolean
  isReady: boolean
  isDeleting: boolean
}

type BillsViewModel = {
  state: BillsViewModelState
  setSearchQuery: (value: string) => void
  setBranchFilter: (value: string) => void
  deleteBill: (billId: string) => Promise<boolean>
  reload: () => Promise<void>
}

export function useBillsViewModel(getBillsUseCase: GetBillsUseCase): BillsViewModel {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")

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
    await refetch()
  }

  const allBills = bills ?? []

  const filteredBills = allBills.filter((bill) => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      bill.companyName.toLowerCase().includes(normalizedSearch) ||
      bill.branchName.toLowerCase().includes(normalizedSearch) ||
      bill.id.toLowerCase().includes(normalizedSearch) ||
      bill.phoneNumber.toLowerCase().includes(normalizedSearch)

    const matchesBranch =
      branchFilter === "all" ? true : bill.branchId === branchFilter

    return matchesSearch && matchesBranch
  })

  const status: BillsStatus =
    queryStatus === "success" ? "ready" :
    queryStatus === "error" ? "error" :
    "loading"

  const state: BillsViewModelState = {
    status,
    bills: allBills,
    filteredBills,
    searchQuery,
    branchFilter,
    error: deleteError?.message ?? queryError?.message ?? null,
    isLoading: queryStatus === "pending",
    isReady: queryStatus === "success",
    isDeleting,
  }

  return {
    state,
    setSearchQuery,
    setBranchFilter,
    deleteBill,
    reload,
  }
}
