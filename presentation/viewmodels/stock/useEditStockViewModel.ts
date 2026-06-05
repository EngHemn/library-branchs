"use client"

import { useEffect, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  editStockFormSchema,
  type EditStockFormValues,
} from "@/domain/schemas/stockFormSchema"
import type { StockRow } from "@/domain/entities/stock/Stock"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import type { EditStockStatus, EditStockViewModelState } from "./EditStockViewModelState"

type EditStockViewModel = {
  state: EditStockViewModelState
  form: ReturnType<typeof useForm<EditStockFormValues>>
  save: (values: EditStockFormValues) => Promise<void>
}

export function useEditStockViewModel(
  stockId: string,
  stockUseCase: StockUseCase
): EditStockViewModel {
  const queryClient = useQueryClient()
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<EditStockFormValues>({
    resolver: zodResolver(editStockFormSchema) as Resolver<EditStockFormValues>,
    defaultValues: {
      quantity: 0,
      minStock: 1,
      notes: "",
    },
  })

  const stockRowsQuery = useQuery({
    queryKey: ["stock-rows"],
    queryFn: async () => {
      const result = await stockUseCase.getStockRows()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const stockRow =
    stockRowsQuery.data?.find((item) => item.id === stockId) ?? null
  const isNotFound = stockRowsQuery.isSuccess && stockRow === null

  useEffect(() => {
    if (stockRow) {
      form.reset({
        quantity: stockRow.currentStock,
        minStock: stockRow.minStock,
        notes: "",
      })
    }
  }, [stockRow, form])

  const saveMutation = useMutation({
    mutationFn: async (values: EditStockFormValues) => {
      const result = await stockUseCase.updateStock({
        stockId,
        quantity: values.quantity,
        minStock: values.minStock,
        notes: values.notes,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      setIsSaved(true)
      void queryClient.invalidateQueries({ queryKey: ["stock-rows"] })
    },
    onError: (err: Error) => setError(err.message),
  })

  async function save(values: EditStockFormValues): Promise<void> {
    setError(null)
    await saveMutation.mutateAsync(values).catch(() => undefined)
  }

  const isLoading = stockRowsQuery.isPending
  const isSaving = saveMutation.isPending

  const status: EditStockStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : stockRowsQuery.isError
        ? "error"
        : isLoading
          ? "loading"
          : "ready"

  const state: EditStockViewModelState = {
    status,
    stockRow,
    error,
    isNotFound,
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
