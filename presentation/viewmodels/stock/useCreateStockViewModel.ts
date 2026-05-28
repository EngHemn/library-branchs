"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createStockFormSchema,
  type CreateStockFormValues,
} from "@/domain/schemas/stockFormSchema"
import type { StockRow } from "@/domain/entities/stock/Stock"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"

type CreateStockStatus = "idle" | "loading" | "ready" | "saving" | "saved" | "error"

type CreateStockState = {
  status: CreateStockStatus
  error: string | null
  books: { id: string; name: string }[]
  branches: { id: string; name: string }[]
  subBranches: { id: string; name: string }[]
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}

type CreateStockViewModel = {
  state: CreateStockState
  form: ReturnType<typeof useForm<CreateStockFormValues>>
  save: (values: CreateStockFormValues) => Promise<void>
}

function toUniqueBooks(rows: StockRow[]): { id: string; name: string }[] {
  const map = new Map<string, string>()
  rows.forEach((row) => {
    if (!map.has(row.bookId)) map.set(row.bookId, row.bookTitle)
  })
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

function toUniqueBranches(rows: StockRow[]): { id: string; name: string }[] {
  const map = new Map<string, string>()
  rows.forEach((row) => {
    if (!map.has(row.branchId)) map.set(row.branchId, row.branchName)
  })
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

function toSubBranches(
  rows: StockRow[],
  branchId: string
): { id: string; name: string }[] {
  const map = new Map<string, string>()
  rows.forEach((row) => {
    if (row.branchId === branchId && row.subBranchId && row.subBranchName) {
      map.set(row.subBranchId, row.subBranchName)
    }
  })
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}

export function useCreateStockViewModel(
  stockUseCase: StockUseCase
): CreateStockViewModel {
  const [status, setStatus] = useState<CreateStockStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<StockRow[]>([])

  const form = useForm<CreateStockFormValues>({
    resolver: zodResolver(createStockFormSchema as never),
    defaultValues: {
      bookId: "",
      branchId: "",
      subBranchId: "none",
      initialStock: 0,
      minStock: 1,
    },
  })

  const selectedBranchId = form.watch("branchId")

  useEffect(() => {
    let cancelled = false

    async function loadRows() {
      setStatus("loading")
      const result = await stockUseCase.getStockRows()
      if (cancelled) return

      if (!result.success) {
        setStatus("error")
        setError(result.error)
        return
      }

      setRows(result.data)
      setStatus("ready")
    }

    void loadRows()
    return () => {
      cancelled = true
    }
  }, [stockUseCase])

  const save = useCallback(
    async (values: CreateStockFormValues) => {
      setStatus("saving")
      setError(null)

      const result = await stockUseCase.createStock({
        bookId: values.bookId,
        branchId: values.branchId,
        subBranchId: values.subBranchId === "none" ? null : values.subBranchId,
        initialStock: values.initialStock,
        minStock: values.minStock,
      })

      if (!result.success) {
        setStatus("ready")
        setError(result.error)
        return
      }

      setStatus("saved")
    },
    [stockUseCase]
  )

  const books = useMemo(() => toUniqueBooks(rows), [rows])
  const branches = useMemo(() => toUniqueBranches(rows), [rows])
  const subBranches = useMemo(
    () => toSubBranches(rows, selectedBranchId ?? ""),
    [rows, selectedBranchId]
  )

  useEffect(() => {
    form.setValue("subBranchId", "none")
  }, [selectedBranchId, form])

  const state = useMemo<CreateStockState>(
    () => ({
      status,
      error,
      books,
      branches,
      subBranches,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [status, error, books, branches, subBranches]
  )

  return { state, form, save }
}
