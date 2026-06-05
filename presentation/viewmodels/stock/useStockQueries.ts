"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  AddStockInput,
  ReduceStockInput,
  StockRow,
  StockSummary,
  TransferStockInput,
} from "@/domain/entities/stock/Stock"
import type { StockMovement } from "@/domain/entities/stock/StockMovement"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"

export type StockQueriesResult = {
  stockRows: StockRow[]
  stockStatus: AsyncStatus
  stockError: string | null
  summary: StockSummary | null
  summaryStatus: AsyncStatus
  movements: StockMovement[]
  movementsStatus: AsyncStatus
  movementsError: string | null
  isSubmitting: boolean
  submitError: string | null
  setSubmitError: (error: string | null) => void
  addStock: (input: AddStockInput) => Promise<void>
  reduceStock: (input: ReduceStockInput) => Promise<void>
  transferStock: (input: TransferStockInput) => Promise<void>
  reload: () => Promise<void>
}

function toAsyncStatus(
  isPending: boolean,
  isError: boolean,
  isSuccess: boolean
): AsyncStatus {
  if (isPending) return "loading"
  if (isError) return "error"
  if (isSuccess) return "success"
  return "idle"
}

export function useStockQueries(stockUseCase: StockUseCase): StockQueriesResult {
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const stockRowsQuery = useQuery({
    queryKey: ["stock-rows"],
    queryFn: async () => {
      const result = await stockUseCase.getStockRows()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const summaryQuery = useQuery({
    queryKey: ["stock-summary"],
    queryFn: async () => {
      const result = await stockUseCase.getStockSummary()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const movementsQuery = useQuery({
    queryKey: ["stock-movements"],
    queryFn: async () => {
      const result = await stockUseCase.getStockMovements()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const addStockMutation = useMutation({
    mutationFn: async (input: AddStockInput) => {
      const result = await stockUseCase.addStock(input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stock-rows"] }),
    onError: (err: Error) => setSubmitError(err.message),
  })

  const reduceStockMutation = useMutation({
    mutationFn: async (input: ReduceStockInput) => {
      const result = await stockUseCase.reduceStock(input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stock-rows"] }),
    onError: (err: Error) => setSubmitError(err.message),
  })

  const transferStockMutation = useMutation({
    mutationFn: async (input: TransferStockInput) => {
      const result = await stockUseCase.transferStock(input)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["stock-rows"] })
      void queryClient.invalidateQueries({ queryKey: ["stock-movements"] })
    },
    onError: (err: Error) => setSubmitError(err.message),
  })

  async function addStock(input: AddStockInput): Promise<void> {
    await addStockMutation.mutateAsync(input)
  }

  async function reduceStock(input: ReduceStockInput): Promise<void> {
    await reduceStockMutation.mutateAsync(input)
  }

  async function transferStock(input: TransferStockInput): Promise<void> {
    await transferStockMutation.mutateAsync(input)
  }

  async function reload(): Promise<void> {
    await Promise.all([
      stockRowsQuery.refetch(),
      summaryQuery.refetch(),
      movementsQuery.refetch(),
    ])
  }

  return {
    stockRows: stockRowsQuery.data ?? [],
    stockStatus: toAsyncStatus(
      stockRowsQuery.isPending,
      stockRowsQuery.isError,
      stockRowsQuery.isSuccess
    ),
    stockError: stockRowsQuery.error?.message ?? null,
    summary: summaryQuery.data ?? null,
    summaryStatus: toAsyncStatus(
      summaryQuery.isPending,
      summaryQuery.isError,
      summaryQuery.isSuccess
    ),
    movements: movementsQuery.data ?? [],
    movementsStatus: toAsyncStatus(
      movementsQuery.isPending,
      movementsQuery.isError,
      movementsQuery.isSuccess
    ),
    movementsError: movementsQuery.error?.message ?? null,
    isSubmitting:
      addStockMutation.isPending ||
      reduceStockMutation.isPending ||
      transferStockMutation.isPending,
    submitError,
    setSubmitError,
    addStock,
    reduceStock,
    transferStock,
    reload,
  }
}
