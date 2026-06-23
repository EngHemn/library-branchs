"use client"

import { useQuery } from "@tanstack/react-query"

import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import type {
  BillDetailStatus,
  BillDetailViewModelState,
} from "./BillDetailViewModelState"

type BillDetailViewModel = {
  state: BillDetailViewModelState
  reload: () => Promise<void>
}

export function useBillDetailViewModel(
  billId: string,
  getBillsUseCase: GetBillsUseCase
): BillDetailViewModel {
  const {
    data,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["bills", billId],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillById(billId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  async function reload(): Promise<void> {
    await refetch()
  }

  const status: BillDetailStatus =
    queryStatus === "error"
      ? "error"
      : queryStatus === "pending"
        ? "loading"
        : data === null
          ? "not-found"
          : "loaded"

  const state: BillDetailViewModelState = {
    status,
    bill: data ?? null,
    error: queryError?.message ?? null,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload }
}
