"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  createStockFormSchema,
  type CreateStockFormValues,
} from "@/domain/schemas/stockFormSchema"
import type { StockRow } from "@/domain/entities/stock/Stock"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import type { CreateStockStatus, CreateStockViewModelState } from "./CreateStockViewModelState"

type CreateStockViewModel = {
  state: CreateStockViewModelState
  form: ReturnType<typeof useForm<CreateStockFormValues>>
  save: (values: CreateStockFormValues) => Promise<void>
}

function toUniqueBooks(rows: StockRow[]): { id: string; name: string }[] {
  const map = new Map<string, string>()
  for (const row of rows) {
    if (!map.has(row.bookId)) map.set(row.bookId, row.bookTitle)
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

function toUniqueBranches(rows: StockRow[]): { id: string; name: string }[] {
  const map = new Map<string, string>()
  for (const row of rows) {
    if (!map.has(row.branchId)) map.set(row.branchId, row.branchName)
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

function toSubBranches(
  rows: StockRow[],
  branchId: string
): { id: string; name: string }[] {
  const map = new Map<string, string>()
  for (const row of rows) {
    if (row.branchId === branchId && row.subBranchId && row.subBranchName) {
      map.set(row.subBranchId, row.subBranchName)
    }
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

export function useCreateStockViewModel(
  stockUseCase: StockUseCase
): CreateStockViewModel {
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateStockFormValues>({
    resolver: zodResolver(createStockFormSchema),
    defaultValues: {
      bookId: "",
      branchId: "",
      subBranchId: "none",
      initialStock: 0,
      minStock: 1,
    },
  })

  const selectedBranchId = form.watch("branchId")

  const stockRowsQuery = useQuery({
    queryKey: ["stock-rows"],
    queryFn: async () => {
      const result = await stockUseCase.getStockRows()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (values: CreateStockFormValues) => {
      const result = await stockUseCase.createStock({
        bookId: values.bookId,
        branchId: values.branchId,
        subBranchId: values.subBranchId === "none" ? null : values.subBranchId,
        initialStock: values.initialStock,
        minStock: values.minStock,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => setIsSaved(true),
    onError: (err: Error) => setError(err.message),
  })

  useEffect(() => {
    form.setValue("subBranchId", "none")
  }, [selectedBranchId, form])

  async function save(values: CreateStockFormValues): Promise<void> {
    setError(null)
    await saveMutation.mutateAsync(values).catch(() => undefined)
  }

  const rows = stockRowsQuery.data ?? []
  const isLoading = stockRowsQuery.isPending
  const isSaving = saveMutation.isPending

  const status: CreateStockStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : isLoading
        ? "loading"
        : "ready"

  const state: CreateStockViewModelState = {
    status,
    error,
    books: toUniqueBooks(rows),
    branches: toUniqueBranches(rows),
    subBranches: toSubBranches(rows, selectedBranchId ?? ""),
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
