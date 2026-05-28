"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Sale } from "@/domain/entities/sales/Sale"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

type SalesHistoryStatus = "idle" | "loading" | "success" | "error"

type SalesHistoryState = {
  status: SalesHistoryStatus
  sales: Sale[]
  error: string | null
}

export type SalesHistoryViewModel = {
  state: SalesHistoryState
  reload: () => Promise<void>
}

export function useSalesHistoryViewModel(
  salesUseCase: SalesUseCase
): SalesHistoryViewModel {
  const [status, setStatus] = useState<SalesHistoryStatus>("idle")
  const [sales, setSales] = useState<Sale[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadSalesHistory = useCallback(async (): Promise<void> => {
    setStatus("loading")
    setError(null)

    const result = await salesUseCase.getSalesHistory()
    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    setSales(result.data)
    setStatus("success")
  }, [salesUseCase])

  useEffect(() => {
    void loadSalesHistory()
  }, [loadSalesHistory])

  const state = useMemo<SalesHistoryState>(
    () => ({
      status,
      sales,
      error,
    }),
    [status, sales, error]
  )

  return {
    state,
    reload: loadSalesHistory,
  }
}
