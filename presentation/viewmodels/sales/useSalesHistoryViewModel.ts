"use client"

import { useQuery } from "@tanstack/react-query"

import type { Sale } from "@/domain/entities/sales/Sale"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import type { SalesHistoryStatus, SalesHistoryViewModelState } from "./SalesHistoryViewModelState"

export type SalesHistoryViewModel = {
  state: SalesHistoryViewModelState
  reload: () => Promise<void>
}

export function useSalesHistoryViewModel(
  salesUseCase: SalesUseCase
): SalesHistoryViewModel {
  const salesHistoryQuery = useQuery({
    queryKey: ["sales-history"],
    queryFn: async () => {
      const result = await salesUseCase.getSalesHistory()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  async function reload(): Promise<void> {
    await salesHistoryQuery.refetch()
  }

  const status: SalesHistoryStatus = salesHistoryQuery.isPending
    ? "loading"
    : salesHistoryQuery.isError
      ? "error"
      : salesHistoryQuery.isSuccess
        ? "success"
        : "idle"

  const state: SalesHistoryViewModelState = {
    status,
    sales: salesHistoryQuery.data ?? [],
    error: salesHistoryQuery.error?.message ?? null,
  }

  return { state, reload }
}
