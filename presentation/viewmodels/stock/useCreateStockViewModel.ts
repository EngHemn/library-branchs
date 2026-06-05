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
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import type { CreateStockStatus, CreateStockViewModelState } from "./CreateStockViewModelState"
import type { StockBookOption } from "@/presentation/components/stock/StockBookSearchCombobox"

type CreateStockViewModel = {
  state: CreateStockViewModelState
  form: ReturnType<typeof useForm<CreateStockFormValues>>
  save: (values: CreateStockFormValues) => Promise<void>
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

function getMainBranchIdForSubBranch(
  rows: StockRow[],
  subBranchId: string
): string | null {
  const match = rows.find((row) => row.subBranchId === subBranchId)
  return match?.branchId ?? null
}

function toBookOptions(
  books: Array<{
    id: string
    title: string
    isbn: string
    author: string
  }>
): StockBookOption[] {
  return books.map((book) => ({
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    author: book.author,
  }))
}

export function useCreateStockViewModel(
  authUseCase: AuthUseCase,
  getBooksUseCase: GetBooksUseCase,
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

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const stockRowsQuery = useQuery({
    queryKey: ["stock-rows"],
    queryFn: async () => {
      const result = await stockUseCase.getStockRows()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooksUseCase.getBooks()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
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

  const user = userQuery.data ?? null
  const rows = stockRowsQuery.data ?? []
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const isSubBranchUser = user?.branchType === "sub"
  const showSubBranchField = !isSubBranchUser
  const effectiveBranchId = isSubBranchUser
    ? getMainBranchIdForSubBranch(rows, userBranchId) ?? userBranchId
    : userBranchId

  useEffect(() => {
    if (!effectiveBranchId) return
    form.setValue("branchId", effectiveBranchId)
  }, [effectiveBranchId, form])

  useEffect(() => {
    form.setValue("subBranchId", "none")
  }, [effectiveBranchId, form])

  async function save(values: CreateStockFormValues): Promise<void> {
    setError(null)

    const branchId = isSubBranchUser
      ? getMainBranchIdForSubBranch(rows, userBranchId) ?? values.branchId
      : values.branchId

    const subBranchId = isSubBranchUser
      ? userBranchId
      : values.subBranchId === "none"
        ? null
        : values.subBranchId

    await saveMutation
      .mutateAsync({
        ...values,
        branchId,
        subBranchId: subBranchId ?? "none",
      })
      .catch(() => undefined)
  }

  const isLoading =
    userQuery.isPending || stockRowsQuery.isPending || booksQuery.isPending
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
    books: toBookOptions(booksQuery.data ?? []),
    subBranches: toSubBranches(rows, effectiveBranchId),
    showSubBranchField,
    isLoading,
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
