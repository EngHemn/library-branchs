"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  editStockFormSchema,
  type EditStockFormValues,
} from "@/domain/schemas/stockFormSchema"
import type { StockRow } from "@/domain/entities/stock/Stock"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"

type EditStockStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

type EditStockState = {
  status: EditStockStatus
  stockRow: StockRow | null
  error: string | null
  isNotFound: boolean
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditStockViewModel = {
  state: EditStockState
  form: ReturnType<typeof useForm<EditStockFormValues>>
  save: (values: EditStockFormValues) => Promise<void>
}

export function useEditStockViewModel(
  stockId: string,
  stockUseCase: StockUseCase
): EditStockViewModel {
  const [status, setStatus] = useState<EditStockStatus>("idle")
  const [stockRow, setStockRow] = useState<StockRow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)

  const form = useForm<EditStockFormValues>({
    resolver: zodResolver(editStockFormSchema as never),
    defaultValues: {
      quantity: 0,
      minStock: 1,
      notes: "",
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadRow() {
      setStatus("loading")
      const result = await stockUseCase.getStockRows()
      if (cancelled) return

      if (!result.success) {
        setStatus("error")
        setError(result.error)
        return
      }

      const row = result.data.find((item) => item.id === stockId)
      if (!row) {
        setIsNotFound(true)
        setStatus("ready")
        return
      }

      setStockRow(row)
      form.reset({
        quantity: row.currentStock,
        minStock: row.minStock,
        notes: "",
      })
      setStatus("ready")
    }

    void loadRow()
    return () => {
      cancelled = true
    }
  }, [stockId, stockUseCase, form])

  const save = useCallback(
    async (values: EditStockFormValues) => {
      setStatus("saving")
      setError(null)

      const result = await stockUseCase.updateStock({
        stockId,
        quantity: values.quantity,
        minStock: values.minStock,
        notes: values.notes,
      })

      if (!result.success) {
        setStatus("ready")
        setError(result.error)
        return
      }

      setStockRow(result.data)
      setStatus("saved")
    },
    [stockId, stockUseCase]
  )

  const state = useMemo<EditStockState>(
    () => ({
      status,
      stockRow,
      error,
      isNotFound,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [status, stockRow, error, isNotFound]
  )

  return { state, form, save }
}
