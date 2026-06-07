"use client"

import { useQuery } from "@tanstack/react-query"

import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import type {
  OrderDetailStatus,
  OrderDetailViewModelState,
} from "./OrderDetailViewModelState"

type OrderDetailViewModel = {
  state: OrderDetailViewModelState
  reload: () => Promise<void>
}

export function useOrderDetailViewModel(
  orderId: string,
  getOrdersUseCase: GetOrdersUseCase
): OrderDetailViewModel {
  const {
    data,
    status: queryStatus,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const result = await getOrdersUseCase.getOrderById(orderId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  async function reload(): Promise<void> {
    await refetch()
  }

  const status: OrderDetailStatus =
    queryStatus === "error"
      ? "error"
      : queryStatus === "pending"
        ? "loading"
        : data === null
          ? "not-found"
          : "loaded"

  const state: OrderDetailViewModelState = {
    status,
    order: data ?? null,
    error: queryError?.message ?? null,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    isNotFound: status === "not-found",
    isError: status === "error",
  }

  return { state, reload }
}
