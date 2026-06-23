"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"

export type SalesDataResult = {
  branches: Branch[]
  branchesStatus: AsyncStatus
  branchesError: string | null
  books: SaleBook[]
  booksStatus: AsyncStatus
  booksError: string | null
  displayedBranchId: string | null
  isPlacingSale: boolean
  saleResult: Sale | null
  saleError: string | null
  setDisplayedBranch: (branchId: string) => void
  placeSale: (branchId: string, cart: CartItem[]) => Promise<void>
  resetSale: () => void
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

export function useSalesData(salesUseCase: SalesUseCase): SalesDataResult {
  const queryClient = useQueryClient()
  const [displayedBranchId, setDisplayedBranchId] = useState<string | null>(
    null
  )
  const [saleResult, setSaleResult] = useState<Sale | null>(null)
  const [saleError, setSaleError] = useState<string | null>(null)

  const branchesQuery = useQuery({
    queryKey: ["sales-branches"],
    queryFn: async () => {
      const result = await salesUseCase.getBranches()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const booksQuery = useQuery({
    queryKey: ["sales-books", displayedBranchId],
    queryFn: async () => {
      if (!displayedBranchId) {
        const result = await salesUseCase.getAllBooks()
        if (!result.success) throw new Error(result.error)
        return result.data
      }
      const result = await salesUseCase.getBooksByBranch(displayedBranchId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const placeSaleMutation = useMutation({
    mutationFn: async ({
      branchId,
      cart,
    }: {
      branchId: string
      cart: CartItem[]
    }) => {
      const result = await salesUseCase.placeSale(branchId, cart)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (data) => {
      setSaleResult(data)
      void queryClient.invalidateQueries({ queryKey: ["sales-books"] })
    },
    onError: (err: Error) => setSaleError(err.message),
  })

  function setDisplayedBranch(branchId: string): void {
    setDisplayedBranchId(branchId)
  }

  async function placeSale(branchId: string, cart: CartItem[]): Promise<void> {
    setSaleError(null)
    await placeSaleMutation.mutateAsync({ branchId, cart })
  }

  function resetSale(): void {
    setSaleResult(null)
    setSaleError(null)
  }

  return {
    branches: branchesQuery.data ?? [],
    branchesStatus: toAsyncStatus(
      branchesQuery.isPending,
      branchesQuery.isError,
      branchesQuery.isSuccess
    ),
    branchesError: branchesQuery.error?.message ?? null,
    books: booksQuery.data ?? [],
    booksStatus: toAsyncStatus(
      booksQuery.isPending,
      booksQuery.isError,
      booksQuery.isSuccess
    ),
    booksError: booksQuery.error?.message ?? null,
    displayedBranchId,
    isPlacingSale: placeSaleMutation.isPending,
    saleResult,
    saleError,
    setDisplayedBranch,
    placeSale,
    resetSale,
  }
}
