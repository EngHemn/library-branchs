"use client"

import type { Bill } from "@/domain/entities/bill/Bill"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"

export type BillsStatus = "idle" | "loading" | "ready" | "error"

export type BillsViewModelState = {
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
